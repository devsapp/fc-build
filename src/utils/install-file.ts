import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import logger from '../common/logger';
import * as parser from './parser';
import { readLines } from './utils';
import { buildImage, copyFromImage } from './docker';

const uuid = require('uuid');

export async function getFunfile(codeUri: string) {
  const funfilePath = path.join(codeUri, 'Funfile');
  if (await fs.pathExists(funfilePath)) {
    return funfilePath;
  }
  return null;
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
