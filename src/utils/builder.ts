import { HLogger, ILogger } from '@serverless-devs/core';
import Docker from 'dockerode';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import _ from 'lodash';
import fcBuilders from '@alicloud/fc-builders';
import { execSync } from 'child_process';
import { checkCodeUri, getExcludeFilesEnv } from './utils';
import { generateBuildContainerBuildOpts } from './build-opts';
import { dockerRun, resolvePasswdMount } from './docker';
import { CONTEXT, FC_BACKEND } from './constant';
import { IBuildInput, ICodeUri, IBuildDir } from '../interface';
import { getFunfile, processFunfileForBuildkit } from './install-file';
import { generateDockerfileForBuildkit } from './buildkit';
import { mockDockerConfigFile } from './mock-cr-login';

interface INeedBuild {
  baseDir: string;
  runtime: string;
  codeUri?: string | ICodeUri;
}

interface IBuildOutput {
  image?: string;
  buildSaveUri?: string;
}

export default class Builder {
  @HLogger(CONTEXT) logger: ILogger;

  private readonly useDocker: boolean;
  private dockerfile: string;
  private fcCore: any;
  private projectName: string;
  private configDirPath: any;
  private readonly useBuildkit: boolean;
  private readonly enableBuildkitServer: boolean;
  private readonly buildkitServerPort: number;
  static stages: string[] = ['install', 'build'];
  static defaultbuildkitServerPort = 65360;
  private buildImageEnv: string;

  constructor(projectName: string, useDocker: boolean, dockerfile: string, configPath: string, useBuildkit: boolean, fcCore: any) {
    this.fcCore = fcCore;
    this.projectName = projectName;
    this.dockerfile = dockerfile;
    this.configDirPath = configPath ? path.dirname(configPath) : process.cwd();

    // set useDocker and useBuildkit
    const escapeDockerArgsInBuildFC = +process.env.escapeDockerArgsInBuildFC;
    const setBuildkitArgsDefaultInBuildFC = +process.env.setBuildkitArgsDefaultInBuildFC;
    const enableBuildkitServer = +process.env.enableBuildkitServer;
    const buildkitServerPort = +process.env.buildkitServerPort;
    if (setBuildkitArgsDefaultInBuildFC) {
      this.logger.debug('set useBuildkit arg default when building function');
      this.useDocker = false;
      this.useBuildkit = true;
    } else if (useDocker && escapeDockerArgsInBuildFC) {
      this.logger.debug('escape useDocker arg when building function');
      this.useDocker = false;
      this.useBuildkit = true;
    } else if (useBuildkit) {
      if (useDocker) {
        this.logger.warn('--use-buildkit and --use-docker both exist, fc will use buildkit to build.');
      }
      this.useDocker = false;
      this.useBuildkit = true;
    } else if (useDocker) {
      this.useDocker = true;
      this.useBuildkit = false;
    }

    this.enableBuildkitServer = enableBuildkitServer === 1;
    if (this.enableBuildkitServer) {
      if (!this.useBuildkit) {
        this.logger.warn('useBuildkit flag is set false, enableBuildkitServer environment is not working.');
        this.enableBuildkitServer = false;
      } else {
        this.buildkitServerPort = buildkitServerPort || Builder.defaultbuildkitServerPort;
      }
    }

    this.buildImageEnv = process.env.BUILD_IMAGE_ENV;
    if (this.buildImageEnv === FC_BACKEND) {
      this.useDocker = false;
      this.useBuildkit = false;
    }
  }

  private checkCustomContainerConfig(customContainerConfig: any): {dockerFileName: string; imageName: string} {
    if (_.isEmpty(customContainerConfig?.image)) {
      const errorMessage = 'function::customContainerConfig::image atttribute value is empty in the configuration file.';
      throw new this.fcCore.CatchableError(errorMessage);
    }

    const dockerFileName = path.resolve(this.dockerfile || 'Dockerfile');
    if (!fs.existsSync(dockerFileName)) {
      const msg = 'Cannot find the Dockerfile file, please make sure the Dockerfile file exists in the current working directory, or specify the Dockerfile file path through --dockerfile <path>';
      throw new this.fcCore.CatchableError(msg);
    }

    return {
      dockerFileName,
      imageName: customContainerConfig.image,
    };
  }

  private async buildImageWithBuildkit(buildInput: IBuildInput): Promise<string> {
    const { customContainerConfig } = buildInput.functionProps;
    const { dockerFileName, imageName } = this.checkCustomContainerConfig(customContainerConfig);
    if (this.enableBuildkitServer) {
      execSync(`buildctl --addr tcp://localhost:${this.buildkitServerPort} build --no-cache \
            --frontend dockerfile.v0 \
            --local context=${path.dirname(dockerFileName)} \
            --local dockerfile=${path.dirname(dockerFileName)} \
            --output type=image,name=${imageName}`, {
        stdio: 'inherit',
      });
    } else {
      execSync(`buildctl build --no-cache \
            --frontend dockerfile.v0 \
            --local context=${path.dirname(dockerFileName)} \
            --local dockerfile=${path.dirname(dockerFileName)} \
            --output type=image,name=${imageName}`, {
        stdio: 'inherit',
      });
    }

    return imageName;
  }

  private async buildImageWithKaniko(buildInput: IBuildInput): Promise<string> {
    const { customContainerConfig } = buildInput.functionProps;
    const { dockerFileName, imageName } = this.checkCustomContainerConfig(customContainerConfig);
    await mockDockerConfigFile(buildInput.region, imageName, buildInput.credentials);
    this.logger.info('start to build image ...');
    execSync(`executor  --force --cache=false \
                --dockerfile ${dockerFileName} \
                --context  ${path.dirname(dockerFileName)} \
                --destination ${imageName} `, {
      stdio: 'inherit',
    });

    return imageName;
  }

  async buildImage(buildInput: IBuildInput): Promise<string> {
    const { customContainerConfig } = buildInput.functionProps;
    const { dockerFileName, imageName } = this.checkCustomContainerConfig(customContainerConfig);

    this.logger.info('Building image...');
    execSync(`docker build -t ${imageName} -f ${dockerFileName} .`, {
      stdio: 'inherit',
      cwd: path.dirname(dockerFileName),
    });
    this.logger.log(`Build image(${imageName}) successfully`);
    return imageName;
  }

  async build(buildInput: IBuildInput): Promise<IBuildOutput> {
    const { useDocker, useBuildkit } = this;
    const { functionProps, cleanUselessImage } = buildInput;
    const { codeUri, runtime } = functionProps;
    const baseDir = this.configDirPath;
    const isContainer = runtime === 'custom-container';
    if (useBuildkit) {
      this.logger.info('Use buildkit for building.');
    }
    if (isContainer) {
      if (useDocker) {
        await this.fcCore.preExecute?.(new Docker(), cleanUselessImage);
        this.logger.info('Use docker for building.');
      } else if (this.buildImageEnv === FC_BACKEND) {
        this.logger.debug('Use Kaniko for building.');
      }
    }
    this.logger.debug(`[${this.projectName}] Runtime is ${runtime}.`);

    if (isContainer) {
      let image: string;
      if (this.buildImageEnv === FC_BACKEND) {
        image = await this.buildImageWithKaniko(buildInput);
        return { image };
      }
      if (this.useBuildkit) {
        image = await this.buildImageWithBuildkit(buildInput);
      } else {
        image = await this.buildImage(buildInput);
      }
      return { image };
    }

    const src = checkCodeUri(codeUri);
    const funfilePath = await getFunfile({ codeUri: src, runtime, baseDir });

    const codeSkipBuild = funfilePath || await this.codeSkipBuild({ baseDir, codeUri, runtime });
    this.logger.debug(`[${this.projectName}] Code skip build: ${codeSkipBuild}.`);

    if (!codeSkipBuild) {
      return {};
    }

    const resolvedCodeUri = path.isAbsolute(src) ? src : path.join(baseDir, src);
    const funcArtifactDir = await this.initBuildArtifactDir({ baseDir, serviceName: buildInput.serviceProps.name, functionName: buildInput.functionProps.name });
    const buildSaveUri = funcArtifactDir;
    if (useBuildkit) {
      await this.buildInBuildtkit(buildInput, baseDir, resolvedCodeUri, funcArtifactDir, funfilePath);
    } else if (useDocker || funfilePath) {
      await this.buildInDocker(buildInput, baseDir, resolvedCodeUri, funcArtifactDir);
    } else {
      await this.buildArtifact(buildInput, baseDir, resolvedCodeUri, funcArtifactDir);
    }

    await this.fcCore.buildLink({
      configDirPath: baseDir,
      codeUri: src,
      runtime,
      serviceName: buildInput.serviceName,
      functionName: buildInput.functionName,
    }, false);

    return { buildSaveUri };
  }

  private async buildInBuildtkit({
    region,
    serviceProps,
    functionName,
    functionProps,
    verbose = true,
    credentials,
  }: IBuildInput, baseDir: string, codeUri: string, funcArtifactDir: string, funfilePath: string): Promise<void> {
    if (funfilePath) {
      await processFunfileForBuildkit(serviceProps, codeUri, funfilePath, baseDir, funcArtifactDir, functionProps.runtime, functionName, this.enableBuildkitServer, this.buildkitServerPort);
    }
    const targetBuildStage = 'buildresult';
    const dockerfilePath = path.join(codeUri, '.buildkit.generated.dockerfile');
    await generateDockerfileForBuildkit(credentials, region, dockerfilePath, serviceProps,
      functionProps,
      baseDir,
      codeUri,
      funcArtifactDir,
      verbose,
      Builder.stages,
      targetBuildStage);
    // exec build
    if (this.enableBuildkitServer) {
      execSync(
        `buildctl --addr tcp://localhost:${this.buildkitServerPort} build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(dockerfilePath)} --opt filename=${path.basename(dockerfilePath)} --opt target=${targetBuildStage} --output type=local,dest=${baseDir}`, {
          stdio: 'inherit',
        },
      );
    } else {
      execSync(
        `buildctl build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(dockerfilePath)} --opt filename=${path.basename(dockerfilePath)} --opt target=${targetBuildStage} --output type=local,dest=${baseDir}`, {
          stdio: 'inherit',
        },
      );
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

  async buildInDocker({
    region,
    serviceName,
    serviceProps,
    functionName,
    functionProps,
    verbose = true,
    credentials,
  }: IBuildInput, baseDir: string, codeUri: string, funcArtifactDir: string): Promise<void> {
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
    });

    this.logger.debug(
      `[${this.projectName}] Generate Build Container Build Opts: ${JSON.stringify(opts)}`,
    );

    const usedImage = opts.Image;

    this.logger.info(`Build function using image: ${ usedImage}`);

    const exitRs = await dockerRun(opts);
    if (exitRs.StatusCode !== 0) {
      const errorMessage = `build function ${serviceName}/${functionName} error.`;
      throw new this.fcCore.CatchableError(errorMessage);
    }
  }

  async buildArtifact(
    { serviceName, functionName, functionProps, verbose = true }: IBuildInput,
    _baseDir: string, codeUri: string, funcArtifactDir: string,
  ): Promise<void> {
    process.env.BUILD_EXCLIUDE_FILES = getExcludeFilesEnv();
    process.env.TOOL_CACHE_PATH = '.s';

    const { runtime } = functionProps;
    const [result, details] = await this.fcCore.checkLanguage(runtime);
    if (!result && details) {
      throw new this.fcCore.CatchableError(details);
    }

    if (this.fcCore.isInterpretedLanguage(runtime, codeUri)) {
      process.env.ONLY_CPOY_MANIFEST_FILE = 'true';
    }

    const stages = ['install', 'build'];

    // detect fcfile
    const fcfilePath = path.resolve(codeUri, 'fcfile');
    if (fs.existsSync(fcfilePath)) {
      this.logger.log(
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
    );
    await builder.build();
  }

  async codeSkipBuild({ baseDir, codeUri, runtime }: INeedBuild): Promise<boolean> {
    const src = checkCodeUri(codeUri);
    this.logger.debug(`src is: ${src}`);
    if (!src) {
      return false;
    }

    const absCodeUri = path.resolve(baseDir, src);
    const taskFlows = await fcBuilders.Builder.detectTaskFlow(runtime, absCodeUri);
    this.logger.debug(
      `taskFlows isEmpty: ${_.isEmpty(
        taskFlows,
      )},only default task flow is: ${this.isOnlyDefaultTaskFlow(taskFlows)}`,
    );
    this.logger.debug(JSON.stringify(taskFlows));
    if (_.isEmpty(taskFlows) || this.isOnlyDefaultTaskFlow(taskFlows)) {
      this.logger.info('No need build for this project.');
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
    this.logger.debug(`[${this.projectName}] Build save url: ${artifactPath}.`);

    if (fs.pathExistsSync(artifactPath)) {
      this.logger.debug(`[${this.projectName}] Folder already exists, delete folder.`);
      await new Promise((resolve, reject) => {
        rimraf(artifactPath, (err) => {
          if (err) {
            this.logger.error(`Delete dir error: ${artifactPath}`);
            reject(err);
          }
          resolve('');
        });
      });
      // fs.rmdirSync(artifactPath, { recursive: true });
      this.logger.debug(`[${this.projectName}] Deleted folder successfully.`);
    }
    this.logger.debug(`[${this.projectName}] Create build folder.`);
    fs.mkdirpSync(artifactPath);
    this.logger.debug(`[${this.projectName}] Created build folder successfully.`);

    // 每次 build 之前清除 build-link 的缓存，防止生成连接判断条件失效
    try {
      const buildFilesListJSONPath = this.fcCore.genBuildLinkFilesListJSONPath(baseDir, serviceName, functionName);
      this.logger.debug(`[${this.projectName}] Build link save url: ${buildFilesListJSONPath}.`);
      await fs.remove(buildFilesListJSONPath);
    } catch (_ex) { /** 如果异常不阻塞主进程运行 */ }

    return artifactPath;
  }
}
