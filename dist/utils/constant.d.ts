export declare const SUPPORTRUNTIMEBUILDList: string[];
export declare const BUILDCOMMANDList: string[];
export declare const CONTEXT = "FC-BUILD";
export declare const CONTEXT_NAME = "fc-build";
export declare const HELP: ({
    header: string;
    optionList: ({
        name: string;
        description: string;
        alias: string;
        defaultOption: boolean;
        type: StringConstructor;
    } | {
        name: string;
        description: string;
        alias: string;
        type: BooleanConstructor;
        defaultOption?: undefined;
    })[];
    content?: undefined;
} | {
    header: string;
    content: {
        example: string;
    }[];
    optionList?: undefined;
})[];
