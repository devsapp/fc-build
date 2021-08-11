import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import logger from '../common/logger';
import * as parser from './parser';
import { readLines } from './utils';
import { buildImage, copyFromImage } from './docker';

const uuid = require('uuid');

async function fileExists(filePath: string) {
  if (await fs.pathExists(filePath)) {
    return (await fs.stat(filePath)).isFile();
  }
  return false;
}

export async function getFunfile({
  codeUri, runtime, baseDir,
}: { codeUri: string; runtime: string; baseDir: string }): Promise<string | undefined> {
  const funfilePath = path.join(codeUri, 'Funfile');
  const funfileExists = await fileExists(funfilePath);
  logger.debug(`Funfile path: ${funfilePath}; has Funfile: ${funfileExists}`);

  const aptListFilePath = path.join(codeUri, 'apt-get.list');
  const aptListExists = await fileExists(aptListFilePath);
  logger.debug(`apt-get.list path: ${aptListFilePath}; has apt-get.list: ${aptListExists}`);

  if (aptListExists) {
    let fileStr = await converAptFileToFunfile(aptListFilePath, 'apt-get');
    if (fileStr) {
      if (funfileExists) {
        const funStr = await fs.readFile(funfilePath, 'utf8');
        fileStr = `${funStr}${fileStr}`;
      } else {
        fileStr = `RUNTIME ${runtime}\nWORKDIR /code${fileStr}`;
      }
      const cacheFilePath = path.join(baseDir, '.s', 'cacheFunfile');
      await fs.outputFile(cacheFilePath, fileStr);
      return cacheFilePath;
    }
  }

  if (funfileExists) {
    return funfilePath;
  }
}

async function converAptFileToFunfile(filePath: string, command: string) {
  let fileStr = '';
  for (const line of await readLines(filePath)) {
    if (!line.startsWith('#')) {
      fileStr += `\nRUN fun-install ${command} install ${line}`;
    }
  }
  return fileStr;
}

async function convertFunfileToDockerfile(funfilePath, dockerfilePath, runtime, serviceName, functionName) {
  const dockerfileContent = await parser.funfileToDockerfile(funfilePath, runtime, serviceName, functionName);

  await fs.writeFile(dockerfilePath, dockerfileContent);
}

async function getWorkDir(funfilePath: string) {
  try {
    for (const line of await readLines(funfilePath)) {
      if (line.startsWith('WORKDIR ')) {
        const src = _.compact(line.split(' '))[1];
        return `${src}/.`;
      }
    }
  } catch (e) {
    logger.debug(e.toString());
    return '/code/.';
  }
  return '/code/.';
}

export async function processFunfile(
  serviceName: string,
  codeUri: string,
  funfilePath: string,
  funcArtifactDir: string,
  runtime: string,
  functionName: string,
): Promise<string> {
  logger.log('Funfile exist, Fun will use container to build forcely', 'yellow');

  const dockerfilePath = path.join(codeUri, '.Funfile.generated.dockerfile');
  await convertFunfileToDockerfile(funfilePath, dockerfilePath, runtime, serviceName, functionName);

  const tag = `fun-cache-${uuid.v4()}`;
  const imageTag: string = await buildImage(codeUri, dockerfilePath, tag);

  // copy fun install generated artifact files to artifact dir
  logger.log(`copying function artifact to ${funcArtifactDir}`);
  await copyFromImage(imageTag, await getWorkDir(funfilePath), funcArtifactDir);

  // TODO: process nas folder

  // const nasConfig = (serviceRes.Properties || {}).NasConfig;
  // let nasMappings;
  // if (nasConfig) {
  //   nasMappings = await nas.convertNasConfigToNasMappings(nas.getDefaultNasDir(baseDir), nasConfig, serviceName);
  // }
  // await copyNasArtifact(nasMappings, imageTag, baseDir, funcArtifactDir);
  await fs.remove(dockerfilePath);
  await fs.rename(path.join(funcArtifactDir, '.fun'), path.join(funcArtifactDir, '.s'));

  return imageTag;
}
