import _ from 'lodash';
import path from 'path';
import uuid from 'uuid';
import fs from 'fs-extra';
import logger from '../common/logger';
import * as parser from './parser';
import { readLines } from './utils';
import { buildImage, copyFromImage } from './docker';
import { IServiceProps } from '../interface';
import { formatDockerfileForBuildkit } from './buildkit';
import { execSync } from 'child_process';

async function fileExists(filePath: string) {
  if (await fs.pathExists(filePath)) {
    return (await fs.stat(filePath)).isFile();
  }
  return false;
}

export async function getFunfile({
  codeUri, runtime, baseDir,
}: {
  codeUri: string;
  runtime: string;
  baseDir: string;
}): Promise<{ funfileExists: boolean; aptListExists: boolean; checklistFilePath?: string }> {
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
      // process.platform
      return {
        checklistFilePath: cacheFilePath,
        funfileExists,
        aptListExists,
      };
    }
  }

  if (funfileExists) {
    return {
      checklistFilePath: funfilePath,
      funfileExists,
      aptListExists,
    };
  }

  return {
    funfileExists,
    aptListExists,
  };
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

export async function processFunfileForBuildkit(serviceConfig: IServiceProps, codeUri: string, funfilePath: string, baseDir: string, funcArtifactDir: string, runtime: string, functionName: string, enableBuildkitServer?: boolean, buildkitServerPort?: number) {
  logger.info('Funfile exist and useBuildkit is specified, fc will use buildkit to build');
  const dockerfilePath = path.join(codeUri, '.Funfile.buildkit.generated.dockerfile');

  await convertFunfileToDockerfile(funfilePath, dockerfilePath, runtime, serviceConfig.name, functionName);

  const fromSrcToDstPairs = [{
    src: '/code',
    dst: funcArtifactDir,
  }];

  // 生成 dockerfile
  const targetBuildStage = 'buildresult';
  await formatDockerfileForBuildkit(dockerfilePath, fromSrcToDstPairs, baseDir, targetBuildStage);

  if (enableBuildkitServer) {
    execSync(
      `buildctl --addr tcp://localhost:${buildkitServerPort} build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(dockerfilePath)} --opt target=${targetBuildStage} --opt filename=${path.basename(dockerfilePath)} --output type=local,dest=${baseDir}`, {
        stdio: 'inherit',
      },
    );
  } else {
    execSync(
      `buildctl build --no-cache --frontend dockerfile.v0 --local context=${baseDir} --local dockerfile=${path.dirname(dockerfilePath)} --opt target=${targetBuildStage} --opt filename=${path.basename(dockerfilePath)} --output type=local,dest=${baseDir}`, {
        stdio: 'inherit',
      },
    );
  }


  await fs.remove(dockerfilePath);
  if (await fs.pathExists(path.join(funcArtifactDir, '.fun'))) {
    await fs.rename(path.join(funcArtifactDir, '.fun'), path.join(funcArtifactDir, '.s'));
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

  await fs.remove(dockerfilePath);
  if (fs.pathExists(path.join(funcArtifactDir, '.fun'))) {
    await fs.rename(path.join(funcArtifactDir, '.fun'), path.join(funcArtifactDir, '.s'));
  }

  return imageTag;
}
