import { IServiceProps, IFunctionProps, ICredentials } from '../interface';
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
}
export default function generateBuildContainerBuildOpts({ credentials, region, serviceName, serviceProps, functionName, functionProps, baseDir, codeUri, funcArtifactDir, verbose, stages, }: IBuildOpts): Promise<any>;
export {};
