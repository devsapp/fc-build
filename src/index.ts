import {
  help,
  loadComponent,
  getCredential,
  CatchableError,
  lodash as _,
} from '@serverless-devs/core';
import path from 'path';
import Builder from './utils/builder';
import { IInputs, IBuildInput } from './interface';
import { HELP } from './utils/constant';
import logger from './common/logger';
import { compelUseBuildkit, useKaniko } from './utils/utils';
import commandParse from './commandParse';

interface IOutput {
  props: any;
  image?: string;
  buildSaveUri?: string;
}

export default class Build {
  async build(inputs: IInputs) {
    logger.info('Build artifact start...');
    const projectName = _.get(inputs, 'project.projectName');
    logger.debug(`[${projectName}]inputs params: ${JSON.stringify(inputs.props)}`);

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
    }: any = commandParse(inputs, ['custom-args']);

    if (h) {
      help(HELP);
      return;
    }
    if (customEnv) {
      try {
        JSON.parse(customEnv);
      } catch (_ex) {
        const showError = `The parameter passed in by --custom-env is not a standard JSON format: ${customEnv}`;
        throw new CatchableError(showError);
      }
    }

    const { region, service: serviceProps, function: functionProps } = inputs.props;
    const { runtime, name: functionName } = functionProps;
    logger.debug(`[${projectName}] Runtime is ${runtime}.`);

    if (!runtime) {
      throw new CatchableError('Parameter function.runtime is required');
    }

    const serviceName = serviceProps.name;
    const params: IBuildInput = {
      region,
      serviceProps,
      functionProps,
      serviceName,
      dockerfile,
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
    const buildkit = useBuildkit || compelUseBuildkit; // 使用 use-buildkit
    if (buildkit || useKaniko) {
      logger.debug(`credentials becase useBuildkit=${buildkit} or useKaniko=${useKaniko}`);
      params.credentials = _.isEmpty(inputs.credentials)
        ? inputs.credentials
        : await getCredential(inputs.project?.access);
    }

    // 构建 Build 入参
    const useModel = { useSandbox, useKaniko, useBuildkit: buildkit, useDocker };
    const argsPayload = {
      customEnv: customEnv ? JSON.parse(customEnv) : undefined,
      additionalArgs: customArgs ? customArgs.split(' ') : [],
      scriptFile,
      command,
    };
    const configPath = _.get(inputs, 'path.configPath');
    const configDirPath = configPath ? path.dirname(configPath) : process.cwd();
    const fcCore = await loadComponent('devsapp/fc-core');

    const builder = new Builder(projectName, configDirPath, fcCore, useModel, argsPayload);
    await fcCore.setBuildState(serviceName, functionName, '', { status: 'unavailable' }); // 设置 build 开始状态
    const buildOutput = await builder.build(params); // 开始build
    await fcCore.setBuildState(serviceName, functionName, '', { status: 'available' }); // 设置 build 结束状态

    logger.debug(`[${projectName}] Build output: ${JSON.stringify(buildOutput)}`);

    const output: IOutput = { props: inputs.props };
    if (buildOutput.buildSaveUri) {
      output.buildSaveUri = buildOutput.buildSaveUri;
    } else {
      output.image = buildOutput.image;
    }
    logger.info('Build artifact successfully.');
    return output;
  }
}
