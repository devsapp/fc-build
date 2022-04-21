import logger from '../common/logger';
import * as fs from 'fs-extra';
import { DockerfileParser } from 'dockerfile-ast';
import path from 'path';
import { generateDockerfileEnvs, resolveCodeUriToMount } from './docker';
import { ICredentials, IFunctionProps, IServiceProps } from '../interface';
import * as _ from 'lodash';
import generatePwdFile from './passwd';
import { resolveRuntimeToDockerImage } from './get-image-name';

export async function formatDockerfileForBuildkit(dockerfilePath: string, fromSrcToDstPairs: Array<{ src: string; dst: string }>, baseDir: string, targetBuildStage: string) {
  if (!fromSrcToDstPairs) {
    logger.debug('There are no fromSrcToDstPairs');
    return;
  }
  const dockerfileContent = await convertDockerfileToBuildkitFormat(dockerfilePath, fromSrcToDstPairs, baseDir, targetBuildStage);

  await fs.writeFile(dockerfilePath, dockerfileContent);
}

async function convertDockerfileToBuildkitFormat(dockerfilePath: string, fromSrcToDstPairs: Array<{ src: string; dst: string }>, baseDir: string, targetBuildStage: string) {
  const originalContent = await fs.readFile(dockerfilePath, 'utf8');
  if (!targetBuildStage || !fromSrcToDstPairs) {
    logger.debug('There is no output args.');
    return originalContent;
  }
  const parsedContent = DockerfileParser.parse(originalContent);

  const content = [];
  const stages = [];
  for (const instruction of parsedContent.getInstructions()) {
    const ins = instruction.getInstruction();
    const range = instruction.getRange();
    // @ts-ignore
    content.push(instruction.getRangeContent(range));
    if (ins.toUpperCase() === 'FROM') {
      const stage = instruction.getArgumentsContent().toString().split(' as ')[1];
      if (stage) {
        stages.push(stage);
      }
    }
  }

  content.push(`FROM scratch as ${targetBuildStage}`);
  fromSrcToDstPairs.forEach((pair) => {
    stages.forEach((stage) => {
      content.push(`COPY --from=${stage} ${pair.src} ${baseDir === pair.dst ? './' : path.relative(baseDir, pair.dst)}`);
    });
  });

  return content.join('\n');
}

async function resolvePasswdMount(contentDir) {
  if (process.platform === 'linux') {
    return {
      Type: 'bind',
      Source: await generatePwdFile(contentDir),
      Target: '/etc/passwd',
      ReadOnly: true,
    };
  }

  return null;
}

export async function generateDockerfileForBuildkit(credentials: ICredentials, region, dockerfilePath: string, serviceConfig: IServiceProps, functionConfig: IFunctionProps, baseDir: string, codeUri: string, funcArtifactDir: string, verbose: any, stages: string[], targetBuildStage: string, userCustomConfig) {
  logger.log('Generating dockerfile in buildkit format.');
  const { runtime } = functionConfig;
  const { customEnv, additionalArgs } = userCustomConfig || {};

  const envs = await generateDockerfileEnvs(credentials, region, baseDir, serviceConfig, functionConfig, customEnv);

  const codeMount = await resolveCodeUriToMount(path.resolve(baseDir, codeUri), false);

  const funcArtifactMountDir = '/artifactsMount';

  const artifactDirMount = {
    Type: 'bind',
    Source: funcArtifactDir,
    Target: funcArtifactMountDir,
    ReadOnly: false,
  };
  // add password to /etc/passwd
  const passwdMount = await resolvePasswdMount(baseDir);
  const mountsInDocker = _.compact([codeMount, artifactDirMount, passwdMount]);

  const { fromSrcToDstPairsInBuild, fromSrcToDstPairsInOutput } = generateSrcDstPairsFromMounts(mountsInDocker);

  const params = {
    method: 'build',
    serviceName: serviceConfig.name,
    functionName: functionConfig.name,
    sourceDir: '/code',
    runtime,
    artifactDir: codeUri === funcArtifactDir ? '/code' : funcArtifactMountDir,
    stages,
    verbose,
    otherPayload: { additionalArgs }
  };

  const cmd = `fun-install build --json-params '${JSON.stringify(params)}'`;
  const contentDir = baseDir;
  const dockerfileContent = await dockerfileForBuildkit(runtime, fromSrcToDstPairsInOutput, fromSrcToDstPairsInBuild, contentDir, targetBuildStage, envs, cmd);

  await fs.writeFile(dockerfilePath, dockerfileContent);
}

function generateSrcDstPairsFromMounts(mountsInDocker) {
  const fromSrcToDstPairsInBuild = [];
  const fromSrcToDstPairsInOutput = [];
  mountsInDocker.forEach((m) => {
    fromSrcToDstPairsInBuild.push({ src: m.Source, dst: m.Target });
    if (!m.ReadOnly) {
      fromSrcToDstPairsInOutput.push({ src: m.Target, dst: m.Source });
    }
  });
  return { fromSrcToDstPairsInBuild, fromSrcToDstPairsInOutput };
}

async function dockerfileForBuildkit(runtime: string, fromSrcToDstPairsInOutput: any, fromSrcToDstPairsInBuild: any, contentDir: string, targetBuildStage: string, envs: any, cmd: string, workdir?: string) {
  const image = await resolveRuntimeToDockerImage(runtime);

  const content = [];
  content.push(`FROM ${image} as ${runtime}`);
  if (workdir) {
    content.push(`WORKDIR ${workdir}`);
  }

  if (envs) {
    envs.forEach((e) => content.push(`ENV ${e}`));
  }
  if (fromSrcToDstPairsInBuild) {
    fromSrcToDstPairsInBuild.forEach((pair) => content.push(`COPY ${(contentDir === pair.src || path.resolve(contentDir) === pair.src) ? './' : path.relative(contentDir, pair.src)} ${pair.dst}`));
  }
  if (cmd) {
    content.push(`RUN ${cmd}`);
  }

  if (fromSrcToDstPairsInOutput) {
    content.push(`FROM scratch as ${targetBuildStage}`);

    fromSrcToDstPairsInOutput.forEach((pair) => content.push(`COPY --from=${runtime} ${pair.src} ${(contentDir === pair.dst || path.resolve(contentDir) === pair.dst) ? './' : path.relative(contentDir, pair.dst)}`));
  }
  return content.join('\n');
}

