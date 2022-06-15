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
        CONDA_DEFAULT_ENV: string;
    };
    python3: {
        PATH: string;
        CONDA_DEFAULT_ENV: string;
    };
    'python3.9': {
        PATH: string;
        CONDA_DEFAULT_ENV: string;
    };
    custom: {
        PATH: string;
        CONDA_DEFAULT_ENV: string;
    };
};
