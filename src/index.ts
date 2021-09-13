import { reportComponent, commandParse, help } from '@serverless-devs/core';
import Builder from './utils/builder';
import { IInputs, IBuildInput } from './interface';
import { CONTEXT, HELP, CONTEXT_NAME } from './utils/constant';
import Logger from './common/logger';

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
      boolean: ['help', 'use-docker', 'use-buildkit'],
      alias: { dockerfile: 'f', 'use-docker': 'd', help: 'h' },
    };
    const argsData: any = commandParse(inputs, apts).data || {};
    const { dockerfile = '', h }: any = argsData;
    const useBuildkit: boolean = argsData['use-buildkit'];
    const useDocker: boolean = argsData['use-docker'];


    if (h) {
      help(HELP);
      return;
    }

    reportComponent(CONTEXT_NAME, {
      command: 'build',
      uid: inputs.credentials?.AccountID,
      remark: 'fc build',
    });

    const { region, service: serviceProps, function: functionProps } = inputs.props;
    const { runtime } = functionProps;

    if (!runtime) {
      throw new Error('Parameter function.runtime is required');
    }

    const params: IBuildInput = {
      region,
      serviceProps,
      functionProps,
      credentials: {
        AccountID: '',
        AccessKeyID: '',
        AccessKeySecret: '',
      },
      serviceName: serviceProps.name,
      functionName: functionProps.name,
    };

    const builder = new Builder(projectName, useDocker, dockerfile, inputs?.path?.configPath, useBuildkit);

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
    return output;
  }
}
