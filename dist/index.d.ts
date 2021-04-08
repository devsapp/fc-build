import { ILogger } from '@serverless-devs/core';
interface IOutput {
    Properties: any;
    image?: string;
    buildSaveUri?: string;
}
export default class Build {
    logger: ILogger;
    build(inputs: any): Promise<IOutput>;
}
export {};
