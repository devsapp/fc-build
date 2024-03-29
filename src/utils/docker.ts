import { spinner, loadComponent, lodash as _ } from '@serverless-devs/core';
import fs from 'fs-extra';
import tar from 'tar-fs';
import path from 'path';
import Docker from 'dockerode';
import DraftLog from 'draftlog';
import logger from '../common/logger';
import generatePwdFile from './passwd';
import findPathsOutofSharedPaths from './docker-support';
import { resolveLibPathsFromLdConf, checkCodeUri, getExcludeFilesEnv, isDebug } from './utils';
import { addEnv } from './env';
import { IServiceProps, IFunctionProps, IObject, ICredentials } from '../interface';

DraftLog.into(console);

const docker = new Docker();
const containers = new Set();
const isWin = process.platform === 'win32';

interface IDockerEnvs {
  baseDir: string;
  region: string;
  serviceName: string;
  functionName: string;
  serviceProps: IServiceProps;
  functionProps: IFunctionProps;
  credentials: ICredentials;
}

function generateFunctionEnvs(functionProps: IFunctionProps): IObject {
  const { environmentVariables } = functionProps;

  if (!environmentVariables) {
    return {};
  }

  return Object.assign({}, environmentVariables);
}

async function createContainer(opts): Promise<any> {
  const isMac = process.platform === 'darwin';

  logger.debug(`Operating platform: ${process.platform}`);
  if (opts && isMac) {
    if (opts.HostConfig) {
      const pathsOutofSharedPaths = await findPathsOutofSharedPaths(opts.HostConfig.Mounts);
      if (isMac && pathsOutofSharedPaths.length > 0) {
        const errorMessage = `Please add directory '${pathsOutofSharedPaths}' to Docker File sharing list, more information please refer to https://github.com/devsapp/fc/issues/867 `;
        throw new Error(errorMessage);
      }
    }
  }
  const dockerToolBox = await isDockerToolBoxAndEnsureDockerVersion();

  let container;
  try {
    // see https://github.com/apocas/dockerode/pull/38
    container = await docker.createContainer(opts);
  } catch (ex) {
    if (ex.message.indexOf('invalid mount config for type') !== -1 && dockerToolBox) {
      const errorMessage =
        "The default host machine path for docker toolbox is under 'C:\\Users', Please make sure your project is in this directory. If you want to mount other disk paths, please refer to https://github.com/devsapp/fc/issues/867 ";
      throw new Error(errorMessage);
    }
    if (ex.message.indexOf('drive is not shared') !== -1 && isWin) {
      const errorMessage = `${ex.message}More information please refer to https://docs.docker.com/docker-for-windows/#shared-drives`;
      throw new Error(errorMessage);
    }
    throw ex;
  }
  return container;
}

async function isDockerToolBoxAndEnsureDockerVersion(): Promise<boolean> {
  const dockerInfo = await docker.info();
  logger.debug(`Docker info: ${JSON.stringify(dockerInfo)}`);

  await detectDockerVersion(dockerInfo.ServerVersion || '');

  const obj = (dockerInfo.Labels || [])
    .map((e) => _.split(e, '=', 2))
    .filter((e) => e.length === 2)
    .reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {});

  return process.platform === 'win32' && obj.provider === 'virtualbox';
}

async function detectDockerVersion(serverVersion: string): Promise<void> {
  const cur = serverVersion.split('.');
  // 1.13.1
  if (Number.parseInt(cur[0]) === 1 && Number.parseInt(cur[1]) <= 13) {
    const errorMessage = `We detected that your docker version is ${serverVersion}, for a better experience, please upgrade the docker version.`;
    throw new Error(errorMessage);
  }
}

function followProgress(stream, onFinished) {
  const barLines = {};

  const onProgress = (event) => {
    let { status } = event;

    if (event.progress) {
      status = `${event.status} ${event.progress}`;
    }

    if (event.id) {
      const { id } = event;

      if (!barLines[id]) {
        // @ts-ignore: 引入 draftlog 注入的方法
        barLines[id] = console.draft();
      }
      barLines[id](`${id}: ${status}`);
    } else {
      if (_.has(event, 'aux.ID')) {
        event.stream = `${event.aux.ID}\n`;
      }
      // If there is no id, the line should be wrapped manually.
      const out = event.status ? `${event.status}\n` : event.stream;
      process.stdout.write(out);
    }
  };

  docker.modem.followProgress(stream, onFinished, onProgress);
}

export function generateRamdomContainerName(): string {
  return `s_local_${new Date().getTime()}_${Math.random().toString(36).substr(2, 7)}`;
}

export async function generateDockerEnvs(
  {
    region,
    baseDir,
    credentials,
    serviceName,
    serviceProps,
    functionName,
    functionProps,
  }: IDockerEnvs,
  userCustomEnv,
) {
  const envs: IObject = {};

  const { runtime, codeUri } = functionProps;

  // 处理 codeUri，路径可能是绝对路径和相对路径
  let codeSrc = checkCodeUri(codeUri);
  if (path.isAbsolute(codeSrc)) {
    codeSrc = path.relative(baseDir, codeSrc);
  }
  const confEnv = await resolveLibPathsFromLdConf(baseDir, codeSrc);

  const fcCore = await loadComponent('devsapp/fc-core');
  const ONLY_CPOY_MANIFEST_FILE = fcCore.isInterpretedLanguage(runtime, path.join(baseDir, codeSrc))
    ? 'true'
    : '';

  Object.assign(envs, confEnv);
  Object.assign(envs, generateFunctionEnvs(functionProps));

  if (userCustomEnv) {
    Object.assign(envs, userCustomEnv);
  }
  Object.assign(envs, {
    ONLY_CPOY_MANIFEST_FILE,
    local: true,
    BUILD_EXCLIUDE_FILES: getExcludeFilesEnv(),
    TOOL_CACHE_PATH: '.s',
    FC_ACCESS_KEY_ID: credentials.AccessKeyID,
    FC_ACCESS_KEY_SECRET: credentials.AccessKeySecret,
    FC_ACCOUND_ID: credentials.AccountID,
    FC_REGION: region,
    FC_FUNCTION_NAME: functionName,
    FC_HANDLER: functionProps.handler,
    FC_MEMORY_SIZE: functionProps.memorySize || 128,
    FC_TIMEOUT: functionProps.timeout || 3,
    FC_INITIALIZER: functionProps.initializer,
    FC_INITIALIZATIONIMEOUT: functionProps.initializationTimeout || 3,
    FC_SERVICE_NAME: serviceName,
    // @ts-ignore: 多类型，动态判断
    FC_SERVICE_LOG_PROJECT: ((serviceProps || {}).logConfig || {}).project,
    // @ts-ignore: 多类型，动态判断
    FC_SERVICE_LOG_STORE: ((serviceProps || {}).logConfig || {}).logstore,
  });

  return addEnv(envs);
}

interface IMount {
  Type: string;
  Source: string;
  Target: string;
  ReadOnly: boolean;
}

// todo: 当前只支持目录以及 jar。 code uri 还可能是 oss 地址、目录、jar、zip?
export async function resolveCodeUriToMount(absCodeUri: string, readOnly = true): Promise<IMount> {
  let target = null;

  const stats = await fs.lstat(absCodeUri);

  if (stats.isDirectory()) {
    target = '/code';
  } else {
    // could not use path.join('/code', xxx)
    // in windows, it will be translate to \code\xxx, and will not be recorgnized as a valid path in linux container
    target = path.posix.join('/code', path.basename(absCodeUri));
  }

  // Mount the code directory as read only
  return {
    Type: 'bind',
    Source: absCodeUri,
    Target: target,
    ReadOnly: readOnly,
  };
}

export async function resolvePasswdMount(contentDir?: string): Promise<any> {
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

export async function dockerRun(opts: any): Promise<any> {
  const fcCore = await loadComponent('devsapp/fc-core');
  await fcCore.pullImageIfNeed(docker, opts.Image);

  const container = await createContainer(opts);
  const vm = isDebug ? undefined : spinner('builder begin to build\n');

  const attachOpts = {
    hijack: true,
    stream: true,
    stdin: true,
    stdout: isDebug,
    stderr: true,
  };

  const stream = await container.attach(attachOpts);

  if (!isWin) {
    container.modem.demuxStream(stream, process.stdout, process.stderr);
  }

  await container.start();

  // dockerode bugs on windows. attach could not receive output and error
  if (isWin) {
    const logStream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });

    container.modem.demuxStream(logStream, process.stdout, process.stderr);
  }

  containers.add(container.id);

  stream.end();

  // exitRs format: {"Error":null,"StatusCode":0}
  // see https://docs.docker.com/engine/api/v1.37/#operation/ContainerWait
  const exitRs = await container.wait();
  vm?.stop();

  logger.debug(`Container wait: ${JSON.stringify(exitRs)} `);

  containers.delete(container.id);

  return exitRs;
}

export function buildImage(
  dockerBuildDir: string,
  dockerfilePath: string,
  imageTag: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const tarStream = tar.pack(dockerBuildDir);

    docker.buildImage(
      tarStream,
      {
        dockerfile: path.relative(dockerBuildDir, dockerfilePath),
        t: imageTag,
      },
      (error, stream) => {
        containers.add(stream);

        if (error) {
          reject(error);
          return;
        }
        stream.on('error', (e) => {
          containers.delete(stream);
          reject(e);
        });
        stream.on('end', () => {
          containers.delete(stream);
          resolve(imageTag);
        });

        followProgress(stream, (err, res) => {
          err ? reject(err) : resolve(res);
        });
      },
    );
  });
}

async function zipTo(archive, to) {
  await fs.ensureDir(to);

  await new Promise((resolve, reject) => {
    archive.pipe(tar.extract(to)).on('error', reject).on('finish', resolve);
  });
}

export async function generateDockerfileEnvs(
  credentials: ICredentials,
  region: string,
  baseDir: string,
  serviceProps: IServiceProps,
  functionProps: IFunctionProps,
  customEnv,
) {
  const serviceName: string = serviceProps.name;
  const functionName: string = functionProps.name;
  const DockerEnvs = await generateDockerEnvs(
    {
      region,
      baseDir,
      credentials,
      serviceName,
      serviceProps,
      functionName,
      functionProps,
    },
    customEnv,
  );
  const DockerfilEnvs = [];
  Object.keys(DockerEnvs).forEach((key) => {
    DockerfilEnvs.push(`${key}=${DockerEnvs[key]}`);
  });
  return DockerfilEnvs;
}

export async function copyFromImage(imageName, from, to) {
  const container = await docker.createContainer({
    Image: imageName,
  });

  const archive = await container.getArchive({
    path: from,
  });

  await zipTo(archive, to);

  await container.remove();
}

// exit container, when use ctrl + c
function waitingForContainerStopped(): any {
  // see https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
  // @ts-ignore
  const { isRaw } = process;
  const kpCallBack: any = (_char, key) => {
    if (key & key.ctrl && key.name === 'c') {
      // @ts-ignore
      process.emit('SIGINT');
    }
  };
  if (process.platform === 'win32') {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(isRaw);
    }
    process.stdin.on('keypress', kpCallBack);
  }

  let stopping = false;

  process.on('SIGINT', async () => {
    logger.debug(`containers size: ${containers?.size}`);

    if (stopping) {
      return;
    }

    // Just fix test on windows
    // Because process.emit('SIGINT') in test/docker.test.js will not trigger rl.on('SIGINT')
    // And when listening to stdin the process never finishes until you send a SIGINT signal explicitly.
    process.stdin.destroy();

    if (!containers.size) {
      return;
    }

    stopping = true;

    logger.info('\nReceived canncel request, stopping running containers.....');

    const jobs: any[] = [];
    const c: any[] = Array.from(containers);
    for (const container of c) {
      try {
        if (container.destroy) {
          // container stream
          container.destroy();
        } else {
          const con: any = docker.getContainer(container);
          logger.info(`Stopping container ${container}`);

          jobs.push(
            con.kill().catch((ex) => logger.debug(`kill container instance error, error is ${ex}`)),
          );
        }
      } catch (error) {
        logger.debug(`get container instance error, ignore container to stop, error is ${error}`);
      }
    }

    try {
      await Promise.all(jobs);
      logger.info('All containers stopped');
      // 修复Ctrl C 后容器退出，但是程序会 block 住的问题
      process.exit(0);
    } catch (error) {
      logger.error(error);
      process.exit(-1); // eslint-disable-line
    }
  });

  return () => {
    process.stdin.removeListener('keypress', kpCallBack);
    if (process.stdin.isTTY) {
      process.stdin?.setRawMode(isRaw);
    }
  };
}

export function displaySboxTips(codeUri, useSandbox) {
  logger.log('\nWelcom to s sbox environment.', 'yellow');
  logger.log(
    `1. The local mount directory is ${codeUri}, The container instance mount directory is /code
2. It is recommended to install the dependency into the /code directory of the instance to ensure that relevant products can be obtained after the build operation
3. Some NPM packages will cache some information for the system version. It is recommended to add the parameter [--no-shrinkwrap] when using [npm install]${
  useSandbox ? '\n4. Enter [exit] to exit' : ''
}\n`,
    'yellow',
  );
}

export async function startSboxContainer(opts) {
  const fcCore = await loadComponent('devsapp/fc-core');
  await fcCore.pullImageIfNeed(docker, opts.Image);

  const { OpenStdin: isInteractive, Tty: isTty } = opts;
  const container = await createContainer(opts);
  containers.add(container.id);
  await container.start();

  const stream = await container.attach({
    logs: true,
    stream: true,
    stdin: isInteractive,
    stdout: true,
    stderr: true,
  });

  // show outputs
  let logStream;
  if (isTty) {
    stream.pipe(process.stdout);
  } else if (isInteractive || process.platform === 'win32') {
    // 这种情况很诡异，收不到 stream 的 stdout，使用 log 绕过去。
    logStream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });
    container.modem.demuxStream(logStream, process.stdout, process.stderr);
  } else {
    container.modem.demuxStream(stream, process.stdout, process.stderr);
  }

  if (isInteractive) {
    // Connect stdin
    process.stdin.pipe(stream);

    let previousKey;
    const CTRL_P = '\u0010';
    const CTRL_Q = '\u0011';

    process.stdin.on('data', (key) => {
      // Detects it is detaching a running container
      const keyStr = key.toString('ascii');
      if (previousKey === CTRL_P && keyStr === CTRL_Q) {
        container.stop(() => {});
      }
      previousKey = keyStr;
    });
  }

  let resize;

  // @ts-ignore
  const { isRaw } = process;
  const goThrough = waitingForContainerStopped();
  if (isTty) {
    goThrough();

    process.stdin.setRawMode(true);

    resize = async () => {
      const dimensions = {
        h: process.stdout.rows,
        w: process.stdout.columns,
      };

      if (dimensions.h !== 0 && dimensions.w !== 0) {
        await container.resize(dimensions);
      }
    };

    await resize();
    process.stdout.on('resize', resize);

    // 在不加任何 cmd 的情况下 shell prompt 需要输出一些字符才会显示，
    // 这里输入一个空格+退格，绕过这个怪异的问题。
    stream.write(' \b');
  }

  await container.wait();

  // cleanup
  if (isTty) {
    process.stdout.removeListener('resize', resize);
    process.stdin.setRawMode(isRaw);
  }
  if (isInteractive) {
    process.stdin.removeAllListeners();
    process.stdin.unpipe(stream);
    process.stdin.destroy();
  }
  if (logStream) {
    logStream.removeAllListeners();
  }
  stream.unpipe(process.stdout);
  stream.destroy();

  containers.delete(container.id);
  if (!isTty) {
    goThrough();
  }
}
