"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.CONTEXT_NAME = exports.CONTEXT = exports.SUPPORTRUNTIMEBUILDList = void 0;
exports.SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];
exports.CONTEXT = 'FC-BUILD';
exports.CONTEXT_NAME = 'fc-build';
exports.HELP = [
    {
        header: 'Build',
        content: 'Build the dependencies.',
    },
    {
        header: 'Usage',
        content: [
            { example: '$ s exec -- build <option>' },
        ],
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'dockerfile',
                description: 'Specify the dockerfile path',
                alias: 'f',
                defaultOption: false,
                type: String,
            },
            {
                name: 'use-docker',
                description: 'Use docker container to build functions',
                alias: 'd',
                defaultOption: false,
                type: String,
            },
        ],
    },
    {
        header: 'Global Options',
        optionList: [
            {
                name: 'help',
                description: 'Build help for command',
                alias: 'h',
                type: Boolean,
            },
        ],
    },
    {
        header: 'Examples with Yaml',
        content: [
            {
                example: '$ s exec -- build --use-docker',
            },
            {
                example: '$ s exec -- build',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSx1QkFBdUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRWhFLFFBQUEsT0FBTyxHQUFHLFVBQVUsQ0FBQztBQUNyQixRQUFBLFlBQVksR0FBRyxVQUFVLENBQUM7QUFFMUIsUUFBQSxJQUFJLEdBQUc7SUFDbEI7UUFDRSxNQUFNLEVBQUUsT0FBTztRQUNmLE9BQU8sRUFBRSx5QkFBeUI7S0FDbkM7SUFDRDtRQUNFLE1BQU0sRUFBRSxPQUFPO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUU7U0FDMUM7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLFNBQVM7UUFDakIsVUFBVSxFQUFFO1lBQ1Y7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFdBQVcsRUFBRSw2QkFBNkI7Z0JBQzFDLEtBQUssRUFBRSxHQUFHO2dCQUNWLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFdBQVcsRUFBRSx5Q0FBeUM7Z0JBQ3RELEtBQUssRUFBRSxHQUFHO2dCQUNWLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsTUFBTTthQUNiO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixVQUFVLEVBQUU7WUFDVjtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixXQUFXLEVBQUUsd0JBQXdCO2dCQUNyQyxLQUFLLEVBQUUsR0FBRztnQkFDVixJQUFJLEVBQUUsT0FBTzthQUNkO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLG9CQUFvQjtRQUM1QixPQUFPLEVBQUU7WUFDUDtnQkFDRSxPQUFPLEVBQUUsZ0NBQWdDO2FBQzFDO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLG1CQUFtQjthQUM3QjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIn0=