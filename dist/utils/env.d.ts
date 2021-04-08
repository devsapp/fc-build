export declare function addEnv(envVars: any): any;
export declare function generateDebugEnv(runtime: string, debugPort?: string, debugIde?: string): {
    DEBUG_OPTIONS: string;
    XDEBUG_CONFIG?: undefined;
} | {
    DEBUG_OPTIONS?: undefined;
    XDEBUG_CONFIG?: undefined;
} | {
    XDEBUG_CONFIG: string;
    DEBUG_OPTIONS?: undefined;
};
