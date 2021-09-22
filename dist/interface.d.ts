export interface IInputs {
    props: IProperties;
    appName: string;
    args: string;
    path: any;
    credentials: ICredentials;
    project: {
        component: string;
        access: string;
        projectName: string;
    };
}
export interface IBuildInput {
    serviceName: string;
    functionName: string;
    serviceProps?: IServiceProps;
    functionProps?: IFunctionProps;
    verbose?: boolean;
    region?: string;
    credentials?: ICredentials;
}
export interface IProperties {
    region: string;
    service: IServiceProps;
    function: IFunctionProps;
}
interface ILogConfig {
    project: string;
    logstore: string;
    enableRequestMetrics?: boolean;
}
export interface IServiceProps {
    name: string;
    logConfig?: ILogConfig;
    nasConfig?: NasConfig;
}
export interface NasConfig {
    userId?: number;
    groupId?: number;
    mountPoints: MountPoint[];
}
export interface MountPoint {
    serverAddr?: string;
    nasDir: string;
    fcDir: string;
}
export interface IFunctionProps {
    name: string;
    runtime: string;
    codeUri: string | ICodeUri;
    handler: string;
    memorySize?: number;
    timeout?: number;
    initializer?: string;
    initializationTimeout: number;
    environmentVariables?: {
        [key: string]: any;
    };
    customContainerConfig?: {
        image: string;
        command?: string;
        args?: string;
    };
}
export interface ICodeUri {
    src?: string;
    bucket?: string;
    object?: string;
    excludes?: string[];
    includes?: string[];
}
export interface IBuildDir {
    baseDir: string;
    serviceName: string;
    functionName: string;
}
export interface IObject {
    [key: string]: any;
}
export interface ICredentials {
    AccountID: string;
    AccessKeyID: string;
    AccessKeySecret: string;
    SecurityToken?: string;
}
export declare function isCredentials(arg: any): arg is ICredentials;
export {};
