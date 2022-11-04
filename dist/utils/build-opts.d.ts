import { IServiceProps, IFunctionProps, ICredentials, IBuildInput } from '../interface';
interface IBuildOpts {
    region: string;
    serviceName: string;
    functionName: string;
    serviceProps: IServiceProps;
    functionProps: IFunctionProps;
    baseDir: string;
    codeUri: string;
    funcArtifactDir: string;
    verbose: boolean;
    stages: string[];
    credentials: ICredentials;
    userCustomConfig?: any;
}
export declare function generateBuildContainerBuildOpts({ credentials, region, serviceName, serviceProps, functionName, functionProps, baseDir, codeUri, funcArtifactDir, verbose, stages, userCustomConfig, }: IBuildOpts): Promise<any>;
export declare function generateSboxOpts(payload: IBuildInput, dockerPayload: any, baseDir: any): Promise<{
    Image?: undefined;
    Hostname?: undefined;
    AttachStdin?: undefined;
    AttachStdout?: undefined;
    AttachStderr?: undefined;
    User?: undefined;
    Tty?: undefined;
    OpenStdin?: undefined;
    StdinOnce?: undefined;
    Env?: undefined;
    Cmd?: undefined;
    HostConfig?: undefined;
} | {
    Image: string;
    Hostname: string;
    AttachStdin: any;
    AttachStdout: boolean;
    AttachStderr: boolean;
    User: string;
    Tty: boolean;
    OpenStdin: any;
    StdinOnce: boolean;
    Env: any;
    Cmd: string[];
    HostConfig: {
        AutoRemove: boolean;
        Mounts: any;
    };
}>;
export {};
