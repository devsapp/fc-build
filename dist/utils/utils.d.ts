import { ICodeUri, IObject } from '../interface';
export declare const isDebug: boolean;
export declare function sleep(ms: number): Promise<unknown>;
export declare function getExcludeFilesEnv(): string;
export declare function checkCodeUri(codeUri: string | ICodeUri): string;
export declare function readLines(fileName: string): Promise<string[]>;
export declare function resolveLibPathsFromLdConf(baseDir: string, codeUri: string): Promise<IObject>;
