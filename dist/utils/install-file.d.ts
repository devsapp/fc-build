import { IServiceProps } from '../interface';
export declare function getFunfile({ codeUri, runtime, baseDir, }: {
    codeUri: string;
    runtime: string;
    baseDir: string;
}): Promise<string | undefined>;
export declare function processFunfileForBuildkit(serviceConfig: IServiceProps, codeUri: string, funfilePath: string, baseDir: string, funcArtifactDir: string, runtime: string, functionName: string, enableBuildkitServer?: boolean, buildkitServerPort?: number): Promise<void>;
export declare function processFunfile(serviceName: string, codeUri: string, funfilePath: string, funcArtifactDir: string, runtime: string, functionName: string): Promise<string>;
