import { ICodeUri, IBuildDir, IObject, IServiceProps, IFunctionProps } from '../interface';
export declare function sleep(ms: number): Promise<unknown>;
export declare function getExcludeFilesEnv(): string;
export declare function isCopyCodeBuildRuntime(runtime: string): boolean;
export declare function checkCommands(commands: string[], runtime: string): void;
export declare function checkCodeUri(codeUri: string | ICodeUri): string;
export declare function getArtifactPath({ baseDir, serviceName, functionName }: IBuildDir): string;
export declare function readLines(fileName: string): Promise<any[]>;
export declare function resolveLibPathsFromLdConf(baseDir: string, codeUri: string): Promise<IObject>;
interface ISaveBuild {
    region: string;
    serviceProps: IServiceProps;
    functionProps: IFunctionProps;
    project: IProject;
}
interface IProject {
    [key: string]: any;
}
export declare function saveBuildYaml({ region, serviceProps, functionProps, project, }: ISaveBuild): Promise<void>;
export {};
