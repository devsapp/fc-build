import _ from 'lodash';
import path from 'path';
import nestedObjectAssign from 'nested-object-assign';
import * as docker from './docker';
import { IServiceProps, IFunctionProps, ICredentials } from '../interface';
import { resolveRuntimeToDockerImage } from './get-image-name';
import { processFunfile, getFunfile } from './install-file';
import { addEnv } from './env';
import {DEFAULT_REGISTRY, DOCKER_REGISTRIES} from "./parser";
import * as httpx from 'httpx';

let DOCKER_REGISTRY_CACHE;

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

  let imageName: string;
  const filePath = await getFunfile({ codeUri, runtime, baseDir });
  if (filePath) {
    imageName = await processFunfile(serviceName, codeUri, filePath, funcArtifactDir, runtime, functionName);
  }
  const opts = await generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs, imageName);

  return opts;
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

// export async function resolveImageNameForPull(imageName) {
//
//   const dockerImageRegistry = await resolveDockerRegistry();
//
//   if (dockerImageRegistry) {
//     imageName = `${dockerImageRegistry}/${imageName}`;
//   }
//   return imageName;
// }

export async function resolveDockerRegistry() {
  if (DOCKER_REGISTRY_CACHE) {
    return DOCKER_REGISTRY_CACHE;
  }
  const promises = DOCKER_REGISTRIES.map(r => httpx.request(`https://${r}/v2/aliyunfc/runtime-nodejs8/tags/list`, { timeout: 3000 }).then(() => r));
  try {
    DOCKER_REGISTRY_CACHE = await Promise.race(promises);
  } catch (error) {
    DOCKER_REGISTRY_CACHE = DEFAULT_REGISTRY;
  }
  return DOCKER_REGISTRY_CACHE;
}

