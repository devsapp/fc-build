import { lodash as _ } from '@serverless-devs/core';
import { IObject } from '../interface';

const sysLibs = [
  '/usr/local/lib',
  '/usr/lib',
  '/usr/lib/x86_64-linux-gnu',
  '/usr/lib64',
  '/lib',
  '/lib/x86_64-linux-gnu',
  '/python/lib/python2.7/site-packages',
  '/python/lib/python3.6/site-packages',
  '/python/lib/python3.9/site-packages',
];
const sysPaths = ['/usr/local/bin', '/usr/local/sbin', '/usr/bin', '/usr/sbin', '/sbin', '/bin'];
const fcPaths = ['/code', '/code/node_modules/.bin'];
const fcLibs = ['/code', '/code/lib', '/usr/local/lib'];
const modulePaths = ['/python/bin', '/node_modules/.bin'];

function duplicateRemoval(str: string): string {
  const spliceValue = str.split(':');
  return _.union(spliceValue).join(':');
}

function generateLibPath(envs: IObject, prefix: string): string {
  let libPath = _.union(
    sysLibs.map((p) => `${prefix}/root${p}`),
    fcLibs,
  ).join(':');

  if (envs.LD_LIBRARY_PATH) {
    libPath = `${envs.LD_LIBRARY_PATH}:${libPath}`;
  }
  return duplicateRemoval(libPath);
}

function generatePath(envs: IObject, prefix: string): string {
  let path = _.union(
    sysPaths.map((p) => `${prefix}/root${p}`),
    fcPaths,
    modulePaths.map((p) => `${prefix}${p}`),
    sysPaths,
  ).join(':');

  if (envs.PATH) {
    path = `${envs.PATH}:${path}`;
  }

  return duplicateRemoval(path);
}

function generateNodePaths(envs: IObject, prefix: string): string {
  const defaultPath = '/usr/local/lib/node_modules';
  const customPath = `${prefix}/node_modules`;

  let path;
  if (envs.NODE_PATH) {
    path = `${envs.NODE_PATH}:${customPath}:${defaultPath}`;
  } else {
    path = `${customPath}:${defaultPath}`;
  }
  return duplicateRemoval(path);
}

export function addEnv(envVars) {
  const envs = Object.assign({}, envVars);

  const prefix = '/code/.s';

  envs.LD_LIBRARY_PATH = generateLibPath(envs, prefix);
  envs.PATH = generatePath(envs, prefix);
  envs.NODE_PATH = generateNodePaths(envs, '/code');

  const defaultPythonPath = `${prefix}/python`;
  if (!envs.PYTHONUSERBASE) {
    envs.PYTHONUSERBASE = defaultPythonPath;
  }

  return envs;
}
