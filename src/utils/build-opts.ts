import { report } from '@serverless-devs/core';
import _ from 'lodash';
import path from 'path';
import nestedObjectAssign from 'nested-object-assign';
import * as docker from './docker';
import { addEnv } from './env';
import { CONTEXT } from './constant';
import { IServiceProps, IFunctionProps, ICredentials } from '../interface';

const pkg = require('../../package.json');
const { FC_DOCKER_VERSION } = process.env;

const IMAGE_VERSION = FC_DOCKER_VERSION || pkg['fc-docker'].version || '1.9.2';
const DEFAULT_REGISTRY = pkg['fc-docker'].registry_default || 'registry.hub.docker.com';
const runtimeImageMap = {
  nodejs6: 'nodejs6',
  nodejs8: 'nodejs8',
  nodejs10: 'nodejs10',
  nodejs12: 'nodejs12',
  'python2.7': 'python2.7',
  python3: 'python3.6',
  java8: 'java8',
  'php7.2': 'php7.2',
  'dotnetcore2.1': 'dotnetcore2.1',
  custom: 'custom',
};

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
}

export default async function generateBuildContainerBuildOpts({
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
}: IBuildOpts): Promise<any> {
  const { runtime } = functionProps;

  const containerName = docker.generateRamdomContainerName();

  const envs = await docker.generateDockerEnvs({
    region,
    baseDir,
    serviceName,
    serviceProps,
    functionName,
    credentials,
    functionProps,
  });

  const codeMount = await docker.resolveCodeUriToMount(path.resolve(baseDir, codeUri), false);

  const passwdMount = await docker.resolvePasswdMount();

  const funcArtifactMountDir = '/artifactsMount';

  const artifactDirMount = {
    Type: 'bind',
    Source: funcArtifactDir,
    Target: funcArtifactMountDir,
    ReadOnly: false,
  };

  const mounts = _.compact([codeMount, artifactDirMount, passwdMount]);

  const params = {
    method: 'build',
    serviceName,
    functionName,
    sourceDir: '/code',
    runtime,
    artifactDir: codeUri === funcArtifactDir ? '/code' : funcArtifactMountDir,
    stages,
    verbose,
  };

  const cmd = ['fun-install', 'build', '--json-params', JSON.stringify(params)];

  const opts = await generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs);

  return opts;
}

async function generateContainerBuildOpts(
  runtime: string,
  containerName: string,
  mounts: string[],
  cmd: string[],
  envs: string[],
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

  const imageName = await resolveRuntimeToDockerImage(runtime);

  const opts = nestedObjectAssign(
    {
      Env: resolveDockerEnv(envs),
      Image: imageName,
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

async function resolveRuntimeToDockerImage(runtime: string): Promise<string> {
  if (runtimeImageMap[runtime]) {
    const name = runtimeImageMap[runtime];
    const imageName = `${DEFAULT_REGISTRY}/aliyunfc/runtime-${name}:build-${IMAGE_VERSION}`;
    return imageName;
  }
  const errorMessage = `resolveRuntimeToDockerImage: invalid runtime name ${runtime}. Supported list: ${Object.keys(
    runtimeImageMap,
  )}`;

  await report(errorMessage, {
    type: 'error',
    context: CONTEXT,
  });

  throw new Error(errorMessage);
}

function resolveDockerEnv(envs = {}) {
  return _.map(addEnv(envs || {}), (v, k) => `${k}=${v}`);
}
