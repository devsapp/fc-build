import { ICredentials, IFunctionProps, IServiceProps } from '../interface';
export declare function formatDockerfileForBuildkit(dockerfilePath: string, fromSrcToDstPairs: Array<{
    src: string;
    dst: string;
}>, baseDir: string, targetBuildStage: string): Promise<void>;
export declare function generateDockerfileForBuildkit(credentials: ICredentials, region: any, dockerfilePath: string, serviceConfig: IServiceProps, functionConfig: IFunctionProps, baseDir: string, codeUri: string, funcArtifactDir: string, verbose: any, stages: string[], targetBuildStage: string, userCustomConfig: any): Promise<void>;
