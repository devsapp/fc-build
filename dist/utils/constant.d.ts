export declare const HELP: ({
    header: string;
    content: string;
    optionList?: undefined;
} | {
    header: string;
    content: {
        example: string;
    }[];
    optionList?: undefined;
} | {
    header: string;
    optionList: {
        name: string;
        description: string;
        alias: string;
        defaultOption: boolean;
        type: StringConstructor;
    }[];
    content?: undefined;
} | {
    header: string;
    optionList: {
        name: string;
        description: string;
        alias: string;
        type: BooleanConstructor;
    }[];
    content?: undefined;
})[];
export declare const FC_BACKEND = "fc-backend";
export declare const sourceActivate: {
    'python2.7': {
        PATH: string;
        customEnvs: {
            key: string;
            value: string;
        }[];
        cwdVersion: string;
    };
    python3: {
        PATH: string;
        customEnvs: {
            key: string;
            value: string;
        }[];
        cwdVersion: string;
    };
    'python3.9': {
        PATH: string;
        customEnvs: {
            key: string;
            value: string;
        }[];
        cwdVersion: string;
    };
    'python3.10': {
        PATH: string;
        customEnvs: {
            key: string;
            value: string;
        }[];
        cwdVersion: string;
    };
    nodejs12: {
        PATH: string;
        cwdVersion: string;
    };
    nodejs14: {
        PATH: string;
        cwdVersion: string;
    };
    nodejs16: {
        PATH: string;
        cwdVersion: string;
    };
    nodejs18: {
        PATH: string;
        cwdVersion: string;
    };
    custom: {
        PATH: string;
        CONDA_DEFAULT_ENV: string;
        cwdVersion: string;
    };
};
