import _ from 'lodash';
import path from 'path';
import nestedObjectAssign from 'nested-object-assign';
import * as docker from './docker';
import { IServiceProps, IFunctionProps, ICredentials } from '../interface';
import { resolveRuntimeToDockerImage } from './get-image-name';
import { processFunfile, getFunfile } from './install-file';
import { addEnv } from './env';
import logger from '../common/logger';

interface IBuildOpts {
  region: string;
  serviceName: string;
  functionName: string;
  serviceProps: IServiceProps;
  functionProps: IFunctionProps;
  baseDir: string;
  codeUri: string;
  funcArtifactDir: string;
  verbose: boolean;
  stages: string[];
  credentials: ICredentials;
  userCustomConfig?: any;
}

const funcArtifactMountDir = '/artifactsMount';

export async function generateMounts(absCodeUri, funcArtifactDir) {
  const codeMount = await docker.resolveCodeUriToMount(absCodeUri, false);

  const passwdMount = await docker.resolvePasswdMount();


  const artifactDirMount = {
    Type: 'bind',
    Source: funcArtifactDir,
    Target: funcArtifactMountDir,
    ReadOnly: false,
  };
  const testInstall = {
    Type: 'bind',
    Source: '/Users/wb447188/Desktop/fc-builders/output/fun-install',
    Target: '/usr/local/bin/fun-install',
    ReadOnly: false,
  };
  const testsInstall = {
    Type: 'bind',
    Source: '/Users/wb447188/Desktop/fc-builders/output/fun-install',
    Target: '/usr/local/bin/s-install',
    ReadOnly: false,
  };

  return _.compact([codeMount, artifactDirMount, passwdMount, testInstall, testsInstall]);
}

export async function generateBuildContainerBuildOpts({
  credentials,
  region,
  serviceName,
  serviceProps,
  functionName,
  functionProps,
  baseDir,
  codeUri,
  funcArtifactDir,
  verbose,
  stages,
  userCustomConfig,
}: IBuildOpts): Promise<any> {
  const { runtime } = functionProps;
  const { additionalArgs, customEnv } = userCustomConfig;

  const containerName = docker.generateRamdomContainerName();

  // TODO: 加载 env
  const envs = await docker.generateDockerEnvs({
    region,
    baseDir,
    serviceName,
    serviceProps,
    functionName,
    credentials,
    functionProps,
  }, customEnv);

  const mounts = await generateMounts(path.resolve(baseDir, codeUri), funcArtifactDir);

  const params = {
    method: 'build',
    serviceName,
    functionName,
    sourceDir: '/code',
    runtime,
    artifactDir: codeUri === funcArtifactDir ? '/code' : funcArtifactMountDir,
    stages,
    verbose,
    otherPayload: { additionalArgs }
  };

  const cmd = ['fun-install', 'build', '--json-params', JSON.stringify(params)];

  let imageName: string;
  const filePath = await getFunfile({ codeUri, runtime, baseDir });
  if (filePath) {
    imageName = await processFunfile(serviceName, codeUri, filePath, funcArtifactDir, runtime, functionName);
  }
  const opts = await generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs, imageName);

  return opts;
}

export async function generateSboxOpts(payload, configPath) {
  let { imageName, customEnv, additionalArgs } = payload.userCustomConfig;
  const { runtime, codeUri, environmentVariables } = payload.functionProps;
  const isInteractive = true;
  const isTty = isInteractive && process.stdin.isTTY || false;;

  if (!imageName) {
    imageName = await resolveRuntimeToDockerImage(runtime);
    if (!imageName) {
      throw new Error(`invalid runtime name ${runtime}`);
    }
  }

  const baseDir = configPath ? path.dirname(configPath) : process.cwd();;
  const codeResolvePath = path.resolve(baseDir, codeUri);

  const cmd = _.isEmpty(additionalArgs) ? [] : additionalArgs;
  const mounts = await generateMounts(codeResolvePath, codeResolvePath);
  const envs = _.assign({}, Object.assign(environmentVariables || {}, customEnv || {}));
  envs.S_SANDBOX = 's_sandbox'; // 控制 sandbox 显示

  logger.debug(`runtime: ${runtime}`);
  logger.debug(`mounts: ${mounts}`);
  logger.debug(`isTty: ${isTty}`);
  logger.debug(`isInteractive: ${isInteractive}`);

  return {
    Image: imageName,
    Hostname: `fc-${runtime}`,
    AttachStdin: isInteractive,
    AttachStdout: true,
    AttachStderr: true,
    User: resolveDockerUser(),
    Tty: isTty,
    OpenStdin: isInteractive,
    StdinOnce: true,
    Env: resolveDockerEnv(envs),
    Cmd: !_.isEmpty(cmd) ? cmd : ['/bin/bash'],
    HostConfig: {
      AutoRemove: true,
      Mounts: mounts
    }
  };
}

async function generateContainerBuildOpts(
  runtime: string,
  containerName: string,
  mounts: string[],
  cmd: string[],
  envs: string[],
  imageName?: string,
) {
  const hostOpts = {
    HostConfig: {
      AutoRemove: true,
      Mounts: mounts,
    },
  };

  const ioOpts = {
    OpenStdin: true,
    Tty: false,
    StdinOnce: true,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
  };

  const opts = nestedObjectAssign(
    {
      Env: resolveDockerEnv(envs),
      Image: imageName || await resolveRuntimeToDockerImage(runtime),
      name: containerName,
      Cmd: cmd,
      User: resolveDockerUser(),
    },
    ioOpts,
    hostOpts,
  );

  return opts;
}

function resolveDockerUser(): string {
  let userId = 0;
  let groupId = 0;
  if (process.platform === 'linux') {
    userId = process.getuid();
    groupId = process.getgid();
  }

  return `${userId}:${groupId}`;
}

function resolveDockerEnv(envs = {}) {
  return _.map(addEnv(envs || {}), (v, k) => `${k}=${v}`);
}
