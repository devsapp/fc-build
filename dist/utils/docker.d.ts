import { IServiceProps, IFunctionProps, IObject, ICredentials } from '../interface';
interface IDockerEnvs {
    baseDir: string;
    region: string;
    serviceName: string;
    functionName: string;
    serviceProps: IServiceProps;
    functionProps: IFunctionProps;
    credentials: ICredentials;
    ishttpTrigger?: boolean;
    debugPort?: string;
    debugIde?: string;
    debugArgs?: any;
    httpParams?: IObject;
}
export declare function generateRamdomContainerName(): string;
export declare function generateDockerEnvs({ region, baseDir, credentials, serviceName, serviceProps, functionName, functionProps, debugPort, httpParams, ishttpTrigger, debugIde, debugArgs, }: IDockerEnvs): Promise<any>;
interface IMount {
    Type: string;
    Source: string;
    Target: string;
    ReadOnly: boolean;
}
export declare function resolveCodeUriToMount(absCodeUri: string, readOnly?: boolean): Promise<IMount>;
export declare function resolvePasswdMount(): Promise<any>;
export declare function dockerRun(opts: any): Promise<any>;
export declare function pullImageIfNeed(imageName: string): Promise<void>;
export {};
