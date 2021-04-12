import { ILogger } from '@serverless-devs/core';
import { IInputs } from './interface';
interface IOutput {
    props: any;
    image?: string;
    buildSaveUri?: string;
}
export default class Build {
    logger: ILogger;
    build(inputs: IInputs): Promise<IOutput>;
}
export {};
