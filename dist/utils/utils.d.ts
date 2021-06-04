import { ICodeUri, IBuildDir, IObject } from '../interface';
export declare function sleep(ms: number): Promise<unknown>;
export declare function getExcludeFilesEnv(): string;
export declare function isCopyCodeBuildRuntime(runtime: string): boolean;
export declare function checkCommands(useDocker: boolean, runtime: string): void;
export declare function checkCodeUri(codeUri: string | ICodeUri): string;
export declare function getArtifactPath({ baseDir, serviceName, functionName }: IBuildDir): string;
export declare function readLines(fileName: string): Promise<any[]>;
export declare function resolveLibPathsFromLdConf(baseDir: string, codeUri: string): Promise<IObject>;
