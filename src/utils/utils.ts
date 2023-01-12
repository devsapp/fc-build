import { isDebugMode, lodash as _ } from '@serverless-devs/core';
import path from 'path';
import rimraf from 'rimraf';
import readline from 'readline';
import fs from 'fs-extra';
import logger from '../common/logger';

import { ICodeUri, IObject } from '../interface';
import { FC_BACKEND } from './constant';

export const isDebug = isDebugMode() || false;

const { BUILD_IMAGE_ENV, enableBuildkitServer, buildkitServerPort } = process.env;
export const useFcBackend = BUILD_IMAGE_ENV === FC_BACKEND;
export const compelUseBuildkit =
  _.isEqual(enableBuildkitServer, '1') && /^\d+$/.test(buildkitServerPort || '');
export const buildkitServerAddr = process.env.buildkitServerAddr || 'localhost';

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getExcludeFilesEnv(): string {
  return ['.s', 's.yml'].join(';');
}

export function checkCodeUri(codeUri: string | ICodeUri): string {
  if (!codeUri) {
    return '';
  }

  const src: string = _.isString(codeUri) ? codeUri as string : (codeUri as ICodeUri).src;

  if (!src) {
    logger.info('No Src configured, skip building.');
    return '';
  }

  if (_.endsWith(src, '.zip') || _.endsWith(src, '.jar') || _.endsWith(src, '.war')) {
    logger.info('Artifact configured, skip building.');
    return '';
  }
  return src;
}

export function readLines(fileName: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const lines = [];

    readline
      .createInterface({ input: fs.createReadStream(fileName) })
      .on('line', (line) => lines.push(line))
      .on('close', () => resolve(lines))
      .on('error', reject);
  });
}

async function resolveLibPaths(confdPath: string) {
  if (!fs.existsSync(confdPath)) {
    return [];
  }
  const confLines = await Promise.all(
    fs
      .readdirSync(confdPath, 'utf-8')
      .filter((f) => f.endsWith('.conf'))
      .map(async (f) => await readLines(path.join(confdPath, f))),
  );

  return _.flatten(confLines).reduce((lines: any, line: any) => {
    // remove the first and last blanks and leave only the middle
    const found = line.match(/^\s*(\/.*)\s*$/);
    if (found && found[1].startsWith('/')) {
      lines.push(found[1]);
    }
    return lines;
  }, []);
}

export async function resolveLibPathsFromLdConf(
  baseDir: string,
  codeUri: string,
): Promise<IObject> {
  const envs: IObject = {};

  const confdPath = path.resolve(baseDir, codeUri, '.s/root/etc/ld.so.conf.d');

  if (!(await fs.pathExists(confdPath))) {
    return envs;
  }

  const stats = await fs.lstat(confdPath);

  if (stats.isFile()) {
    return envs;
  }

  const libPaths: any = await resolveLibPaths(confdPath);

  if (!_.isEmpty(libPaths)) {
    envs.LD_LIBRARY_PATH = libPaths.map((p) => `/code/.s/root${p}`).join(':');
  }
  return envs;
}

export async function removeBuildCache(fcCore, baseDir, serviceName, functionName) {
  const artifactPath = fcCore.getBuildArtifactPath(baseDir, serviceName, functionName);
  try {
    if (fs.pathExistsSync(artifactPath)) {
      await new Promise((resolve) => {
        rimraf(artifactPath, () => resolve(''));
      });
    }
  } catch (_ex) {
    /** 如果异常不阻塞主进程运行 */
  }

  try {
    const buildFilesListJSONPath = fcCore.genBuildLinkFilesListJSONPath(
      baseDir,
      serviceName,
      functionName,
    );
    await fs.remove(buildFilesListJSONPath);
  } catch (_ex) {
    /** 如果异常不阻塞主进程运行 */
  }
}

export function isAcreeRegistry(imageUrl: string): boolean { // 容器镜像企业服务
  const registry = _.split(imageUrl, '/')[0];
  return registry.includes('registry') && registry.endsWith('cr.aliyuncs.com');
}

export function isVpcAcrRegistry(imageUrl: string) {
  const imageArr = imageUrl.split('/');
  return imageArr[0].includes('registry-vpc');
}

export function vpcImageToInternetImage(region: string, imageUrl: string): string {
  const imageArr = imageUrl.split('/');
  if (isVpcAcrRegistry(imageUrl)) {
    imageArr[0] = _.replace(imageArr[0], `registry-vpc.${region}`, `registry.${region}`);
  }
  return imageArr.join('/');
}

export function shellEscapeStrict(image: string): string {
  if (!_.isString(image)) {
    return image;
  }

  const char_code_list = [];
  const unsafe_char_code_list = [35, 38, 59, 96, 124, 42, 63, 126, 60, 62, 94, 40, 41, 91, 93, 123, 125, 36, 39, 34, 10, 255];
  for (let i = 0; i < image.length; i++) {
    const char_code = image.charCodeAt(i);
    // 排除换行符号 ，; 号, 行结束符号, | 号杜绝 命令连接写法
    if (!unsafe_char_code_list.includes(char_code)) {
      char_code_list.push(char_code);
    }
  }
  return String.fromCharCode(...char_code_list);
}
