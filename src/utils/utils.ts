import { Logger } from '@serverless-devs/core';
import { CONTEXT, SUPPORTRUNTIMEBUILDList } from './constant';
import _ from 'lodash';
import path from 'path';
import readline from 'readline';
import fs from 'fs-extra';

import { ICodeUri, IBuildDir, IObject } from '../interface';

const BUILDARTIFACTS = path.join('.s', 'build', 'artifacts');
export const isDebug = process.env?.temp_params?.includes('--debug');

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getExcludeFilesEnv(): string {
  return [
    '.s',
    's.yml',
  ].join(';');
}

export function isCopyCodeBuildRuntime(runtime: string): boolean {
  for (const supportRuntime of SUPPORTRUNTIMEBUILDList) {
    if (runtime.includes(supportRuntime)) {
      return true;
    }
  }
  return false;
}

export function checkCodeUri(codeUri: string | ICodeUri): string {
  if (!codeUri) {
    return '';
  }

  const src = _.isString(codeUri) ? codeUri : codeUri.src;

  if (!src) {
    Logger.info(CONTEXT, 'No Src configured, skip building.');
    return '';
  }

  if (_.endsWith(src, '.zip') || _.endsWith(src, '.jar') || _.endsWith(src, '.war')) {
    Logger.info(CONTEXT, 'Artifact configured, skip building.');
    return '';
  }
  return src;
}

export function getArtifactPath({ baseDir, serviceName, functionName }: IBuildDir): string {
  const rootArtifact = path.join(baseDir, BUILDARTIFACTS);
  return path.join(rootArtifact, serviceName, functionName);
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

export function isNccPath(targetPath: string): boolean {
  return path.basename(targetPath) === 'dist';
}
