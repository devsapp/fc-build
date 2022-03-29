import { commandParse, help, loadComponent, getCredential } from '@serverless-devs/core';
import Builder from './utils/builder';
import { IInputs, IBuildInput } from './interface';
import { CONTEXT, HELP, FC_BACKEND } from './utils/constant';
import Logger from './common/logger';
import { logger } from '@serverless-devs/core/dist/logger';

Logger.setContent(CONTEXT);
interface IOutput {
  props: any;
  image?: string;
  buildSaveUri?: string;
}

export default class Build {
  async build(inputs: IInputs) {
    Logger.info('Build artifact start...');
    const projectName = inputs.project?.projectName;
    Logger.debug(`[${projectName}]inputs params: ${JSON.stringify(inputs.props)}`);

    const apts = {
      string: ['dockerfile'],
      boolean: ['help', 'use-docker', 'use-buildkit', 'clean-useless-image'],
      alias: { dockerfile: 'f', 'use-docker': 'd', help: 'h' },
    };
    const argsData: any = commandParse(inputs, apts).data || {};
    const { dockerfile = '', h }: any = argsData;
    const useBuildkit: boolean = argsData['use-buildkit'];
    const useDocker: boolean = argsData['use-docker'];
    const cleanUselessImage = argsData['clean-useless-image'];
    const useKaniko: boolean = process.env.BUILD_IMAGE_ENV === FC_BACKEND;

    if (h) {
      help(HELP);
      return;
    }

    const { region, service: serviceProps, function: functionProps } = inputs.props;
    const { runtime } = functionProps;

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
      cleanUselessImage,
      functionName,
      credentials: { // buildkit 需要密钥信息
        AccountID: '',
        AccessKeyID: '',
        AccessKeySecret: '',
        SecurityToken: '',
      },
    };
    if (useBuildkit || useKaniko) {
      logger.debug(`params add credentials becase useBuildkit=${useBuildkit} or useKaniko=${useKaniko}`);
      params.credentials = inputs.credentials?.AccountID ? inputs.credentials : await getCredential(inputs.project?.access);
    }
    await fcCore.setBuildState(serviceName, functionName, '', { status: 'unavailable' });
    const builder = new Builder(projectName, useDocker, dockerfile, inputs?.path?.configPath, useBuildkit, fcCore);

    const output: IOutput = {
      props: inputs.props,
    };

    const buildOutput = await builder.build(params);
    Logger.debug(`[${projectName}] Build output: ${JSON.stringify(buildOutput)}`);
    if (buildOutput.buildSaveUri) {
      output.buildSaveUri = buildOutput.buildSaveUri;
    } else {
      output.image = buildOutput.image;
    }

    Logger.info('Build artifact successfully.');
    await fcCore.setBuildState(serviceName, functionName, '', { status: 'available' });
    return output;
  }
}
