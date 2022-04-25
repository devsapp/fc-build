import {
  help,
  loadComponent,
  getCredential,
  CatchableError,
  lodash as _,
} from '@serverless-devs/core';
import Builder from './utils/builder';
import { IInputs, IBuildInput } from './interface';
import { HELP, FC_BACKEND } from './utils/constant';
import logger from './common/logger';
import { startSboxContainer } from './utils/docker';
import { generateSboxOpts } from './utils/build-opts';
import path from 'path';
import { removeBuildCache } from './utils/utils';
import commandParse from './commandParse';

interface IOutput {
  props: any;
  image?: string;
  buildSaveUri?: string;
}

export default class Build {
  async build(inputs: IInputs) {
    logger.info('Build artifact start...');
    const projectName = inputs.project?.projectName;
    logger.debug(`[${projectName}]inputs params: ${JSON.stringify(inputs.props)}`);

    const apts = {
      string: ['dockerfile', 'custom-env', 'custom-args'],
      boolean: ['help', 'use-sandbox', 'use-docker', 'use-buildkit', 'clean-useless-image'],
      alias: { dockerfile: 'f', 'use-docker': 'd', help: 'h' },
    };
    const argsData: any = commandParse(inputs, apts, ['custom-args']);
    // const argsData: any = commandParse(inputs, apts).data || {};
    logger.debug(JSON.stringify(argsData, null, 2));
    const {
      h,
      dockerfile = '',
      'use-buildkit': useBuildkit,
      'use-docker': useDocker,
      'clean-useless-image': cleanUselessImage,
      'custom-env': customEnv,
      'custom-args': customArgs,
      'use-sandbox': useSandbox,
      command,
      'script-file': scriptFile,
    } = argsData;
    const useKaniko: boolean = process.env.BUILD_IMAGE_ENV === FC_BACKEND;

    if (h) {
      help(HELP);
      return;
    }
    if (customEnv) {
      try {
        JSON.parse(customEnv);
      } catch (_ex) {
        throw new CatchableError(
          `The parameter passed in by --custom-env is not a standard JSON format: ${customEnv}`,
        );
      }
    }

    const { region, service: serviceProps, function: functionProps } = inputs.props;
    const { runtime } = functionProps;
    const configPath = inputs?.path?.configPath;

    const fcCore = await loadComponent('devsapp/fc-core');
    if (!runtime) {
      throw new fcCore.CatchableError('Parameter function.runtime is required');
    }

    const serviceName = serviceProps.name;
    const functionName = functionProps.name;
    const params: IBuildInput = {
      region,
      serviceProps,
      functionProps,
      serviceName,
      userCustomConfig: {
        customEnv: customEnv ? JSON.parse(customEnv) : undefined,
        additionalArgs: customArgs ? customArgs.split(' ') : [],
      },
      cleanUselessImage,
      functionName,
      credentials: {
        // buildkit 需要密钥信息
        AccountID: '',
        AccessKeyID: '',
        AccessKeySecret: '',
        SecurityToken: '',
      },
    };
    if (useBuildkit || useKaniko) {
      logger.debug(
        `params add credentials becase useBuildkit=${useBuildkit} or useKaniko=${useKaniko}`,
      );
      params.credentials = inputs.credentials?.AccountID
        ? inputs.credentials
        : await getCredential(inputs.project?.access);
    }
    await fcCore.setBuildState(serviceName, functionName, '', { status: 'unavailable' });

    const output: IOutput = {
      props: inputs.props,
    };

    if (useSandbox || scriptFile || command) {
      const baseDir = configPath ? path.dirname(configPath) : process.cwd();
      await removeBuildCache(fcCore, baseDir, serviceName, functionName);
      const opts = await generateSboxOpts(params, { useSandbox, scriptFile, command }, baseDir);
      if (!_.isEmpty(opts)) {
        await startSboxContainer(opts);
      }
    } else {
      const builder = new Builder(
        projectName,
        useDocker,
        dockerfile,
        configPath,
        useBuildkit,
        fcCore,
      );
      const buildOutput = await builder.build(params);
      logger.debug(`[${projectName}] Build output: ${JSON.stringify(buildOutput)}`);
      if (buildOutput.buildSaveUri) {
        output.buildSaveUri = buildOutput.buildSaveUri;
      } else {
        output.image = buildOutput.image;
      }
    }

    logger.info('Build artifact successfully.');
    await fcCore.setBuildState(serviceName, functionName, '', { status: 'available' });
    return output;
  }
}
