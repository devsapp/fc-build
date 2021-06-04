import { HLogger, ILogger, reportComponent, getCredential, commandParse, help } from '@serverless-devs/core';
import _ from 'lodash';
import Builder from './utils/builder';
import { IInputs, IBuildInput } from './interface';
import { CONTEXT, HELP, CONTEXT_NAME } from './utils/constant';
import { checkCommands } from './utils/utils';

interface IOutput {
  props: any;
  image?: string;
  buildSaveUri?: string;
}

export default class Build {
  @HLogger(CONTEXT) logger: ILogger;

  async build(inputs: IInputs) {
    // @ts-ignore
    delete inputs.Credentials;
    // @ts-ignore
    delete inputs.credentials;
    
    this.logger.info('Build artifact start...');
    const projectName = inputs.project?.projectName;
    this.logger.debug(`[${projectName}]inputs params: ${JSON.stringify(inputs)}`);

    const apts = {
      string: ['dockerfile'],
      boolean: ['help', 'use-docker'],
      alias: { dockerfile: 'f', 'use-docker': 'd', help: 'h' },
    };
    const { d: useDocker, dockerfile = '', h }: any =
      commandParse({ args: inputs.args }, apts).data || {};

    if (h) {
      help(HELP);
      return;
    }

    const credentials = await getCredential(inputs.project.access);
    reportComponent(CONTEXT_NAME, {
      command: 'build',
      uid: credentials.AccountID,
      remark: 'fc build',
    });

    const { region, service: serviceProps, function: functionProps } = inputs.props;
    const runtime = functionProps.runtime;

    checkCommands(useDocker, runtime);

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

    const builder = new Builder(projectName, useDocker, dockerfile);

    const output: IOutput = {
      props: inputs.props,
    };

    const buildOutput = await builder.build(params);
    this.logger.debug(`[${projectName}] Build output: ${JSON.stringify(buildOutput)}`);
    if (buildOutput.buildSaveUri) {
      output.buildSaveUri = buildOutput.buildSaveUri;
    } else {
      output.image = buildOutput.image;
    }

    this.logger.info('Build artifact successfully.');
    return output;
  }
}
