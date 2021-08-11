export declare function getFunfile({ codeUri, runtime, baseDir, }: {
    codeUri: string;
    runtime: string;
    baseDir: string;
}): Promise<string | undefined>;
export declare function processFunfile(serviceName: string, codeUri: string, funfilePath: string, funcArtifactDir: string, runtime: string, functionName: string): Promise<string>;
