import { IServiceProps, IFunctionProps, ICredentials } from '../interface';
interface IDockerEnvs {
    baseDir: string;
    region: string;
    serviceName: string;
    functionName: string;
    serviceProps: IServiceProps;
    functionProps: IFunctionProps;
    credentials: ICredentials;
}
export declare function generateRamdomContainerName(): string;
export declare function generateDockerEnvs({ region, baseDir, credentials, serviceName, serviceProps, functionName, functionProps, }: IDockerEnvs): Promise<any>;
interface IMount {
    Type: string;
    Source: string;
    Target: string;
    ReadOnly: boolean;
}
export declare function resolveCodeUriToMount(absCodeUri: string, readOnly?: boolean): Promise<IMount>;
export declare function resolvePasswdMount(contentDir?: string): Promise<any>;
export declare function dockerRun(opts: any): Promise<any>;
export declare function buildImage(dockerBuildDir: string, dockerfilePath: string, imageTag: string): Promise<string>;
export declare function generateDockerfileEnvs(credentials: ICredentials, region: string, baseDir: string, serviceProps: IServiceProps, functionProps: IFunctionProps): Promise<any[]>;
export declare function copyFromImage(imageName: any, from: any, to: any): Promise<void>;
export {};
