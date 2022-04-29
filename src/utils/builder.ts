import Docker from 'dockerode';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import { lodash as _ } from '@serverless-devs/core';
import fcBuilders from '@alicloud/fc-builders';
import { execSync } from 'child_process';
import { checkCodeUri, getExcludeFilesEnv, removeBuildCache } from './utils';
import { generateBuildContainerBuildOpts, generateSboxOpts } from './build-opts';
import { dockerRun, resolvePasswdMount, startSboxContainer } from './docker';
import { IBuildInput, ICodeUri, IBuildDir } from '../interface';
import { getFunfile, processFunfileForBuildkit } from './install-file';
import { generateDockerfileForBuildkit } from './buildkit';
import { mockDockerConfigFile } from './mock-cr-login';
import logger from '../common/logger';

interface INeedBuild {
  baseDir: string;
  runtime: string;
  codeUri?: string | ICodeUri;
}

interface IBuildOutput {
  image?: string;
  buildSaveUri?: string;
}

interface IArgsPayload {
  customEnv?: string[];
  additionalArgs?: string[];
  scriptFile?: string;
  command?: string;
}

interface IUseModel {
  useSandbox: boolean;
  useKaniko: boolean;
  useBuildkit: boolean;
  useDocker: boolean;
}

export default class Builder {
  static readonly buildkitServerAddr: string = process.env.buildkitServerAddr || 'localhost';
  static readonly stages: string[] = ['install', 'build'];
  static readonly buildkitServerPort = +process.env.buildkitServerPort || 65360;
  static readonly enableBuildkitServer = _.isEqual(process.env.enableBuildkitServer, '1');

  private readonly fcCore: any;
  private readonly projectName: string;
  private readonly configDirPath: any;
  private readonly argsPayload: IArgsPayload;

  private readonly useBuildkit: boolean;
  private readonly useKaniko: boolean;
  private readonly useSandbox: boolean;
  private readonly useDocker: boolean;

  constructor(
    projectName: string,
    configDirPath: string,
    fcCore: any,
    useModel: IUseModel,
    argsPayload: IArgsPayload = {},
  ) {
    this.fcCore = fcCore;
    this.projectName = projectName;
    this.configDirPath = configDirPath;
    this.argsPayload = argsPayload;
    const { scriptFile, command } = argsPayload;
    const { useKaniko, useBuildkit, useSandbox, useDocker } = useModel;
    if (useKaniko) {
      logger.log('Use kaniko for building');
      this.useKaniko = useKaniko;
    } else if (useBuildkit) {
      logger.info('Use buildkit for building');
      this.useBuildkit = true;
    } else if (useSandbox) {
      logger.info('Use sandbox');
      this.useSandbox = true;
    } else if (useDocker || scriptFile || command) {
      logger.info('Use docker for building');
      this.useDocker = true;
    } else {
      logger.info('build use model useLocal');
    }
  }

  async build(buildInput: IBuildInput): Promise<IBuildOutput> {
    const {
      useSandbox,
      useKaniko,
      useDocker,
      useBuildkit,
      configDirPath: baseDir,
      argsPayload,
    } = this;
    const { functionProps, cleanUselessImage, dockerfile, serviceName, functionName } = buildInput;
    const { codeUri, runtime, customContainerConfig } = functionProps;
    const isContainer = runtime === 'custom-container';

    if (useDocker || useSandbox) {
      await this.fcCore.preExecute?.(new Docker(), cleanUselessImage);
    }

    if (isContainer) {
      const { dockerFileName, imageName } = this.checkCustomContainerConfig(
        customContainerConfig,
        dockerfile,
      );
      let image: string;
      if (useKaniko) {
        image = await this.buildImageWithKaniko(buildInput, dockerFileName, imageName);
        return { image };
      } else if (useBuildkit) {
        image = await this.buildImageWithBuildkit(buildInput, dockerFileName, imageName);
      } else {
        image = await this.buildImage(dockerFileName, imageName);
      }
      return { image };
    }

    const src = checkCodeUri(codeUri);
    const funfilePath = await getFunfile({ codeUri: src, runtime, baseDir });
    const codeSkipBuild = funfilePath || (await this.codeSkipBuild({ baseDir, codeUri, runtime }));
    logger.debug(`[${this.projectName}] Code skip build: ${codeSkipBuild}.`);
    if (!codeSkipBuild) {
      return {};
    }

    const resolvedCodeUri = path.isAbsolute(src) ? src : path.join(baseDir, src);
    const buildLinkParams = {
      configDirPath: baseDir,
      codeUri: src,
      runtime,
      serviceName: buildInput.serviceName,
      functionName: buildInput.functionName,
    };
    const initBuildArtifactDirParams = {
      baseDir,
      serviceName,
      functionName,
    };
    let buildSaveUri;
    if (useKaniko) {
      await removeBuildCache(this.fcCore, baseDir, serviceName, functionName);
      await this.buildArtifact(buildInput, baseDir, resolvedCodeUri, resolvedCodeUri);
      buildSaveUri = resolvedCodeUri;
    } else if (useBuildkit) {
      buildSaveUri = await this.initBuildArtifactDir(initBuildArtifactDirParams);
      await this.buildInBuildtkit(buildInput, baseDir, resolvedCodeUri, buildSaveUri, funfilePath);
    } else if (useSandbox || argsPayload.command || argsPayload.scriptFile) {
      // command 和 scriptFile 使用 sandbox，挂载在 code 目录
      await removeBuildCache(this.fcCore, baseDir, serviceName, functionName);
      const dockerPayload = { useSandbox, ...argsPayload };
      const opts = await generateSboxOpts(buildInput, dockerPayload, baseDir);
      if (!_.isEmpty(opts)) {
        await startSboxContainer(opts);
      }
      buildSaveUri = resolvedCodeUri;
    } else if (useDocker || funfilePath) {
      buildSaveUri = await this.initBuildArtifactDir(initBuildArtifactDirParams);
      await this.buildInDocker(buildInput, baseDir, resolvedCodeUri, buildSaveUri);
      await this.fcCore.buildLink(buildLinkParams, false);
    } else {
      buildSaveUri = await this.initBuildArtifactDir(initBuildArtifactDirParams);
      await this.buildArtifact(buildInput, baseDir, resolvedCodeUri, buildSaveUri);
      await this.fcCore.buildLink(buildLinkParams, false);
    }
    return { buildSaveUri };
  }

  private checkCustomContainerConfig(
    customContainerConfig: any,
    dockerfile,
  ): {
    dockerFileName: string;
    imageName: string;
  } {
    if (_.isEmpty(customContainerConfig?.image)) {
      const errorMessage =
        'function::customContainerConfig::image atttribute value is empty in the configuration file.';
      throw new this.fcCore.CatchableError(errorMessage);
    }

    const dockerFileName = path.resolve(dockerfile || 'Dockerfile');
    if (!fs.existsSync(dockerFileName)) {
      const msg =
        'Cannot find the Dockerfile file, please make sure the Dockerfile file exists in the current working directory, or specify the Dockerfile file path through --dockerfile <path>';
      throw new this.fcCore.CatchableError(msg);
    }

    return {
      dockerFileName,
      imageName: customContainerConfig.image,
    };
  }

  private async buildImageWithBuildkit(
    buildInput: IBuildInput,
    dockerFileName: string,
    imageName: string,
  ): Promise<string> {
    const { enableBuildkitServer, buildkitServerAddr, buildkitServerPort } = Builder;
    logger.debug(`enableBuildkitServer: ${enableBuildkitServer}`);
    logger.debug(`buildkitServerAddr: ${buildkitServerAddr}`);
    logger.debug(`buildkitServerPort: ${buildkitServerPort}`);
    if (enableBuildkitServer) {
      await mockDockerConfigFile(buildInput.region, imageName, buildInput.credentials);
      const execSyncCmd = `buildctl --addr tcp://${buildkitServerAddr}:${buildkitServerPort} build --no-cache \
      --frontend dockerfile.v0 \
      --local context=${path.dirname(dockerFileName)} \
      --local dockerfile=${path.dirname(dockerFileName)} \
      --output type=image,name=${imageName},push=true`;
      logger.debug(`buildImageWithBuildkit enableBuildkitServer execSync:\n${execSyncCmd}`);

      execSync(execSyncCmd, { stdio: 'inherit' });
    } else {
      const execSyncCmd = `buildctl build --no-cache \
      --frontend dockerfile.v0 \
      --local context=${path.dirname(dockerFileName)} \
      --local dockerfile=${path.dirname(dockerFileName)} \
      --output type=image,name=${imageName}`;
      logger.debug(`buildImageWithBuildkit execSync:\n${execSyncCmd}`);
      execSync(execSyncCmd, { stdio: 'inherit' });
    }

    return imageName;
  }

  private async buildImageWithKaniko(
    buildInput: IBuildInput,
    dockerFileName: string,
    imageName: string,
  ): Promise<string> {
    logger.info('start to build image ...');
    await mockDockerConfigFile(buildInput.region, imageName, buildInput.credentials);

    const execSyncCmd = `executor --force=true --cache=false --use-new-run=true --dockerfile ${dockerFileName} --context ${path.dirname(
      dockerFileName,
    )} --destination ${imageName}`;

    logger.debug(`buildImageWithKaniko execSync:\n${execSyncCmd}`);
    execSync(execSyncCmd, { stdio: 'inherit' });

    // 单独处理下 pip install, 复用 container build image 可能会出现 skip pip install
    // 临时 hack, 后续考虑删除下面特殊处理
    const files = fs.readdirSync('/usr/local/lib');
    files.forEach((name) => {
      if (name.startsWith('python3')) {
        const ver = parseFloat(name.substr(8));
        if (ver > 6) {
          console.log(`rm -rf /usr/local/lib/${name}/site-packages`);
          execSync(`rm -rf /usr/local/lib/${name}/site-packages`);
        }
      } else if (name.startsWith('python2')) {
        console.log(`rm -rf /usr/local/lib/${name}/site-packages`);
        execSync(`rm -rf /usr/local/lib/${name}/site-packages`);
        execSync(`rm /usr/local/bin/pip${name.substr(6)}`);
        execSync('rm /usr/local/bin/pip2');
      }
    });
    // reset
    execSync('rm -rf /usr/local/bin/python3');
    execSync('ln -s /usr/local/bin/python3.6 /usr/local/bin/python3');
    execSync('rm -rf /usr/local/bin/python');
    execSync('ln -s /usr/local/bin/python3 /usr/local/bin/python');

    return imageName;
  }

  async buildImage(dockerFileName: string, imageName: string): Promise<string> {
    logger.info('Building image...');
    execSync(`docker build -t ${imageName} -f ${dockerFileName} .`, {
      stdio: 'inherit',
      cwd: path.dirname(dockerFileName),
    });
    logger.log(`Build image(${imageName}) successfully`);
    return imageName;
  }

  private async buildInBuildtkit(
    { region, serviceProps, functionName, functionProps, verbose = true, credentials }: IBuildInput,
    baseDir: string,
    codeUri: string,
    funcArtifactDir: string,
    funfilePath: string,
  ): Promise<void> {
    if (funfilePath) {
      await processFunfileForBuildkit(
        serviceProps,
        codeUri,
        funfilePath,
        baseDir,
        funcArtifactDir,
        functionProps.runtime,
        functionName,
        Builder.enableBuildkitServer,
        Builder.buildkitServerPort,
      );
    }
    const targetBuildStage = 'buildresult';
    const dockerfilePath = path.join(codeUri, '.buildkit.generated.dockerfile');
    await generateDockerfileForBuildkit(
      credentials,
      region,
      dockerfilePath,
      serviceProps,
      functionProps,
      baseDir,
      codeUri,
      funcArtifactDir,
      verbose,
      Builder.stages,
      targetBuildStage,
      this.argsPayload,
    );
    // exec build
    if (Builder.enableBuildkitServer) {
      const execSyncCmd = `buildctl --addr tcp://localhost:${
        Builder.buildkitServerPort
      } build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(
        dockerfilePath,
      )} --opt filename=${path.basename(
        dockerfilePath,
      )} --opt target=${targetBuildStage} --output type=local,dest=${baseDir}`;

      logger.debug(`buildInBuildtkit enableBuildkitServer execSyncCmd: ${execSyncCmd}`);
      execSync(execSyncCmd, { stdio: 'inherit' });
    } else {
      const execSyncCmd = `buildctl build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(
        dockerfilePath,
      )} --opt filename=${path.basename(
        dockerfilePath,
      )} --opt target=${targetBuildStage} --output type=local,dest=${baseDir}`;

      logger.debug(`buildInBuildtkit execSyncCmd: ${execSyncCmd}`);
      execSync(execSyncCmd, { stdio: 'inherit' });
    }

    // clean
    await fs.remove(dockerfilePath);
    const dockerfileInArtifact = path.join(funcArtifactDir, path.basename(dockerfilePath));
    if (await fs.pathExists(dockerfileInArtifact)) {
      await fs.remove(dockerfileInArtifact);
    }
    const passwdMount = await resolvePasswdMount(baseDir);
    if (passwdMount) {
      const pwdFilePath = passwdMount.Source;
      await fs.remove(pwdFilePath);
      const pwdFileInArtifact = path.join(funcArtifactDir, path.basename(pwdFilePath));
      if (await fs.pathExists(pwdFileInArtifact)) {
        await fs.remove(pwdFileInArtifact);
      }
    }
  }

  async buildInDocker(
    {
      region,
      serviceName,
      serviceProps,
      functionName,
      functionProps,
      verbose = true,
      credentials,
    }: IBuildInput,
    baseDir: string,
    codeUri: string,
    funcArtifactDir: string,
  ): Promise<void> {
    const opts = await generateBuildContainerBuildOpts({
      region,
      serviceName,
      serviceProps,
      functionName,
      functionProps,
      baseDir,
      codeUri,
      funcArtifactDir,
      verbose,
      credentials,
      stages: Builder.stages,
      userCustomConfig: this.argsPayload,
    });

    logger.debug(`Generate Build Container Build Opts: ${JSON.stringify(opts)}`);

    const usedImage = opts.Image;

    logger.info(`Build function using image: ${usedImage}`);

    const exitRs = await dockerRun(opts);
    if (exitRs.StatusCode !== 0) {
      const errorMessage = `build function ${serviceName}/${functionName} error.`;
      throw new this.fcCore.CatchableError(errorMessage);
    }
  }

  async buildArtifact(
    { serviceName, functionName, functionProps, verbose = true }: IBuildInput,
    _baseDir: string,
    codeUri: string,
    funcArtifactDir: string,
  ): Promise<void> {
    const { runtime } = functionProps;
    const [result, details] = await this.fcCore.checkLanguage(runtime);
    if (!result && details) {
      throw new this.fcCore.CatchableError(details);
    }

    process.env.BUILD_EXCLIUDE_FILES = getExcludeFilesEnv();
    process.env.TOOL_CACHE_PATH = '.s';
    if (this.fcCore.isInterpretedLanguage(runtime, codeUri)) {
      process.env.ONLY_CPOY_MANIFEST_FILE = 'true';
    }

    const stages = ['install', 'build'];

    // detect fcfile
    const fcfilePath = path.resolve(codeUri, 'fcfile');
    if (fs.existsSync(fcfilePath)) {
      logger.log(
        "Found fcfile in src directory, maybe you want to use 's build --use-docker' ?",
        'yellow',
      );
    }

    const builder = new fcBuilders.Builder(
      serviceName,
      functionName,
      codeUri,
      runtime,
      funcArtifactDir,
      verbose,
      stages,
      this.useKaniko ? this.argsPayload : {},
    );
    await builder.build();
  }

  async codeSkipBuild({ baseDir, codeUri, runtime }: INeedBuild): Promise<boolean> {
    const src = checkCodeUri(codeUri);
    logger.debug(`src is: ${src}`);
    if (!src) {
      return false;
    }

    const absCodeUri = path.resolve(baseDir, src);
    const taskFlows = await fcBuilders.Builder.detectTaskFlow(runtime, absCodeUri);
    logger.debug(
      `taskFlows isEmpty: ${_.isEmpty(
        taskFlows,
      )},only default task flow is: ${this.isOnlyDefaultTaskFlow(taskFlows)}`,
    );
    logger.debug(JSON.stringify(taskFlows));
    if (_.isEmpty(taskFlows) || this.isOnlyDefaultTaskFlow(taskFlows)) {
      logger.info('No need build for this project.');
      return false;
    }

    return true;
  }

  isOnlyDefaultTaskFlow(taskFlows): boolean {
    if (taskFlows.length !== 1) {
      return false;
    }

    return taskFlows[0].name === 'DefaultTaskFlow';
  }

  async initBuildArtifactDir({ baseDir, serviceName, functionName }: IBuildDir): Promise<string> {
    const artifactPath = this.fcCore.getBuildArtifactPath(baseDir, serviceName, functionName);
    logger.debug(`[${this.projectName}] Build save url: ${artifactPath}.`);

    if (fs.pathExistsSync(artifactPath)) {
      logger.debug(`[${this.projectName}] Folder already exists, delete folder.`);
      await new Promise((resolve, reject) => {
        rimraf(artifactPath, (err) => {
          if (err) {
            logger.error(`Delete dir error: ${artifactPath}`);
            reject(err);
          }
          resolve('');
        });
      });
      // fs.rmdirSync(artifactPath, { recursive: true });
      logger.debug(`[${this.projectName}] Deleted folder successfully.`);
    }
    logger.debug(`[${this.projectName}] Create build folder.`);
    fs.mkdirpSync(artifactPath);
    logger.debug(`[${this.projectName}] Created build folder successfully.`);

    // 每次 build 之前清除 build-link 的缓存，防止生成连接判断条件失效
    try {
      const buildFilesListJSONPath = this.fcCore.genBuildLinkFilesListJSONPath(
        baseDir,
        serviceName,
        functionName,
      );
      logger.debug(`[${this.projectName}] Build link save url: ${buildFilesListJSONPath}.`);
      await fs.remove(buildFilesListJSONPath);
    } catch (_ex) {
      /** 如果异常不阻塞主进程运行 */
    }

    return artifactPath;
  }
}
