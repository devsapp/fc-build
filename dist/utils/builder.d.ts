import { ILogger } from '@serverless-devs/core';
import { IBuildInput, ICodeUri, IBuildDir } from '../interface';
interface INeedBuild {
    baseDir: string;
    runtime: string;
    codeUri?: string | ICodeUri;
}
interface IBuildOutput {
    image?: string;
    buildSaveUri?: string;
}
export default class Builder {
    logger: ILogger;
    private commands;
    private dockerfile;
    projectName: string;
    constructor(projectName: string, commands: any[], dockerfile: string);
    buildImage(buildInput: IBuildInput): Promise<string>;
    build(buildInput: IBuildInput): Promise<IBuildOutput>;
    buildInDocker({ region, serviceName, serviceProps, functionName, functionProps, verbose, credentials, }: IBuildInput, src: string): Promise<string>;
    buildArtifact({ serviceName, functionName, functionProps, verbose }: IBuildInput, src: any): Promise<string>;
    codeSkipBuild({ baseDir, codeUri, runtime }: INeedBuild): Promise<boolean>;
    isOnlyDefaultTaskFlow(taskFlows: any): boolean;
    initBuildArtifactDir({ baseDir, serviceName, functionName }: IBuildDir): string;
    isUseDocker(): boolean;
}
export {};