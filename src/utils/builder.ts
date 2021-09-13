import { HLogger, ILogger } from '@serverless-devs/core';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import _ from 'lodash';
import fcBuilders from '@alicloud/fc-builders';
import { execSync } from 'child_process';
import { checkCodeUri, getArtifactPath, getExcludeFilesEnv } from './utils';
import { generateBuildContainerBuildOpts } from './build-opts';
import {dockerRun, resolvePasswdMount} from './docker';
import { CONTEXT } from './constant';
import { IBuildInput, ICodeUri, IBuildDir } from '../interface';
import {getFunfile, processFunfileForBuildkit} from './install-file';
import {generateDockerfileForBuildkit} from "./buildkit";

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
  private projectName: string;
  private configDirPath: any;
  private readonly useBuildkit: boolean;
  public static stages: string[] = ['install', 'build'];

  constructor(projectName: string, useDocker: boolean, dockerfile: string, configPath: string, useBuildkit: boolean) {
    this.projectName = projectName;
    this.dockerfile = dockerfile;
    this.configDirPath = configPath ? path.dirname(configPath) : process.cwd();

    // set useDocker and useBuildkit
    const escapeDockerArgsInBuildFC = +process.env.escapeDockerArgsInBuildFC;
    const setBuildkitArgsDefaultInBuildFC = +process.env.setBuildkitArgsDefaultInBuildFC;
    if (setBuildkitArgsDefaultInBuildFC) {
      this.logger.debug(`set useBuildkit arg default when building function`);
      this.useDocker = false;
      this.useBuildkit = true;
    } else if (useDocker && escapeDockerArgsInBuildFC) {
      this.logger.debug(`escape useDocker arg when building function`);
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
  }

  private checkCustomContainerConfig(customContainerConfig: any): {dockerFileName: string; imageName: string} {
    if (!customContainerConfig) {
      const errorMessage = "No 'CustomContainer' configuration found in Function.";
      throw new Error(errorMessage);
    }

    const dockerFileName = path.resolve(this.dockerfile || 'Dockerfile');
    if (!fs.existsSync(dockerFileName)) {
      const errorMessage = 'Cannot find the Dockerfile file, please make sure the Dockerfile file exists in the current working directory, or specify the Dockerfile file path through --dockerfile <path>';
      throw new Error(errorMessage);
    }

    const imageName = customContainerConfig.image;
    if (!imageName) {
      const errorMessage = 'Function/CustomContainer/Image required.';
      throw new Error(errorMessage);
    }
    return {
      dockerFileName,
      imageName
    }
  }

  private async buildImageWithBuildkit(buildInput: IBuildInput): Promise<string> {
    const { customContainerConfig } = buildInput.functionProps;
    const { dockerFileName, imageName } = this.checkCustomContainerConfig(customContainerConfig);

    execSync(`buildctl build --no-cache \
            --frontend dockerfile.v0 \
            --local context=${path.dirname(dockerFileName)} \
            --local dockerfile=${path.dirname(dockerFileName)} \
            --output type=image,name=${imageName}`, {
      stdio: 'inherit'
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
    const { functionProps } = buildInput;
    const { codeUri, runtime } = functionProps;
    const baseDir = this.configDirPath;
    const isContainer = runtime === 'custom-container';
    if (useBuildkit) {
      this.logger.info('Use buildkit for building.');
    } else if (useDocker || isContainer) {
      this.logger.info('Use docker for building.');
    }

    this.logger.debug(`[${this.projectName}] Runtime is ${runtime}.`);

    if (isContainer) {
      let image: string;
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

    let buildSaveUri: string;
    const resolvedCodeUri = path.join(baseDir, src);

    const funcArtifactDir = await this.initBuildArtifactDir({ baseDir, serviceName: buildInput.serviceProps.name, functionName: buildInput.functionProps.name });
    buildSaveUri = funcArtifactDir;
    if (useBuildkit) {
      await this.buildInBuildtkit(buildInput, baseDir, resolvedCodeUri, funcArtifactDir, funfilePath);
    } else if (useDocker || funfilePath) {
      await this.buildInDocker(buildInput, baseDir, resolvedCodeUri, funcArtifactDir);
    } else {
      await this.buildArtifact(buildInput, baseDir, resolvedCodeUri, funcArtifactDir);
    }

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
      await processFunfileForBuildkit(serviceProps, codeUri, funfilePath, baseDir, funcArtifactDir, functionProps.runtime, functionName);
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
    execSync(
      `buildctl build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(dockerfilePath)} --opt filename=${path.basename(dockerfilePath)} --opt target=${targetBuildStage} --output type=local,dest=${baseDir}`, {
        stdio: 'inherit'
      });
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
      throw new Error(errorMessage);
    }
  }

  async buildArtifact(
    { serviceName, functionName, functionProps, verbose = true }: IBuildInput,
    baseDir: string, codeUri: string, funcArtifactDir: string
  ): Promise<void> {
    process.env.BUILD_EXCLIUDE_FILES = getExcludeFilesEnv();
    process.env.TOOL_CACHE_PATH = '.s';

    const { runtime } = functionProps;

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
    const artifactPath = getArtifactPath({ baseDir, serviceName, functionName });

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
    return artifactPath;
  }
}
