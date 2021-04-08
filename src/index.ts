import { HLogger, ILogger, report, commandParse } from '@serverless-devs/core';
import _ from 'lodash';
import Builder from './utils/builder';
import { IBuildInput } from './interface';
import { CONTEXT } from './utils/constant';
import { checkCommands, saveBuildYaml } from './utils/utils';

interface IOutput {
  Properties: any;
  image?: string;
  buildSaveUri?: string;
}

export default class Build {
  @HLogger(CONTEXT) logger: ILogger;

  async build(inputs) {
    // this.help(inputs, HELP);

    this.logger.info('Build artifact start...');
    const projectName = inputs.Project.ProjectName;
    this.logger.debug(`[${projectName}] inputs params: ${JSON.stringify(inputs)}`);

    const apts = {
      string: ['dockerfile'],
      alias: { dockerfile: 'd' },
    };
    // @ts-ignore
    const { _: commands = [], Parameters: parameters = {} } =
      commandParse({ args: inputs.Args }, apts).data || {};

    const { region, service: serviceProps, function: functionProps } = inputs.Properties;
    const runtime = functionProps.runtime;

    try {
      checkCommands(commands, runtime);
    } catch (e) {
      await report(e, {
        type: 'error',
        context: CONTEXT,
      });
      throw e;
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

    const builder = new Builder(projectName, commands, parameters);

    const output: IOutput = {
      Properties: inputs.Properties,
    };

    const buildOutput = await builder.build(params);
    this.logger.debug(`[${projectName}] Build output: ${JSON.stringify(buildOutput)}`);
    if (buildOutput.buildSaveUri) {
      output.buildSaveUri = buildOutput.buildSaveUri;
      await saveBuildYaml({
        region,
        serviceProps,
        functionProps,
        project: _.cloneDeep(inputs.Project),
      });
    } else {
      output.image = buildOutput.image;
    }

    this.logger.info('Build artifact successfully.');
    return output;
  }
}
