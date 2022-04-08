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
    private readonly useDocker;
    private dockerfile;
    private fcCore;
    private projectName;
    private configDirPath;
    private readonly useBuildkit;
    private readonly enableBuildkitServer;
    private readonly buildkitServerPort;
    static stages: string[];
    static defaultbuildkitServerPort: number;
    private buildImageEnv;
    constructor(projectName: string, useDocker: boolean, dockerfile: string, configPath: string, useBuildkit: boolean, fcCore: any);
    private checkCustomContainerConfig;
    private buildImageWithBuildkit;
    private buildImageWithKaniko;
    buildImage(buildInput: IBuildInput): Promise<string>;
    build(buildInput: IBuildInput): Promise<IBuildOutput>;
    private buildInBuildtkit;
    buildInDocker({ region, serviceName, serviceProps, functionName, functionProps, verbose, credentials, }: IBuildInput, baseDir: string, codeUri: string, funcArtifactDir: string): Promise<void>;
    buildArtifact({ serviceName, functionName, functionProps, verbose }: IBuildInput, _baseDir: string, codeUri: string, funcArtifactDir: string): Promise<void>;
    codeSkipBuild({ baseDir, codeUri, runtime }: INeedBuild): Promise<boolean>;
    isOnlyDefaultTaskFlow(taskFlows: any): boolean;
    initBuildArtifactDir({ baseDir, serviceName, functionName }: IBuildDir): Promise<string>;
}
export {};
