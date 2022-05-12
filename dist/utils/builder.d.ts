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
interface IArgsPayload {
    customEnv?: string[];
    additionalArgs?: string[];
    scriptFile?: string;
    command?: string;
}
interface IUseModel {
    useSandbox: boolean;
    useKaniko: boolean;
    useBuildkit: boolean;
    useDocker: boolean;
}
export default class Builder {
    static readonly stages: string[];
    static readonly buildkitServerPort: number;
    static readonly enableBuildkitServer: boolean;
    private readonly fcCore;
    private readonly projectName;
    private readonly configDirPath;
    private readonly argsPayload;
    private readonly useBuildkit;
    private readonly useKaniko;
    private readonly useSandbox;
    private readonly useDocker;
    constructor(projectName: string, configDirPath: string, fcCore: any, useModel: IUseModel, argsPayload?: IArgsPayload);
    build(buildInput: IBuildInput): Promise<IBuildOutput>;
    private checkCustomContainerConfig;
    private buildImageWithBuildkit;
    private buildImageWithKaniko;
    buildImage(dockerFileName: string, imageName: string): Promise<string>;
    private buildInBuildtkit;
    buildInDocker({ region, serviceName, serviceProps, functionName, functionProps, verbose, credentials, }: IBuildInput, baseDir: string, codeUri: string, funcArtifactDir: string): Promise<void>;
    buildArtifact({ serviceName, functionName, functionProps, verbose }: IBuildInput, _baseDir: string, codeUri: string, funcArtifactDir: string): Promise<void>;
    codeBuild({ baseDir, codeUri, runtime }: INeedBuild): Promise<boolean>;
    isOnlyDefaultTaskFlow(taskFlows: any): boolean;
    initBuildArtifactDir({ baseDir, serviceName, functionName }: IBuildDir): Promise<string>;
}
export {};
