"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.CONTEXT_NAME = exports.CONTEXT = exports.BUILDCOMMANDList = exports.SUPPORTRUNTIMEBUILDList = void 0;
exports.SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];
exports.BUILDCOMMANDList = ['docker', 'local'];
exports.CONTEXT = 'FC-BUILD';
exports.CONTEXT_NAME = 'fc-build';
exports.HELP = [
    {
        header: 'Options',
        optionList: [
            {
                name: 'dockerfile',
                description: '指定 dockerfile 路径',
                alias: 't',
                defaultOption: false,
                type: String,
            },
            {
                name: 'help',
                description: '使用引导',
                alias: 'h',
                type: Boolean,
            },
        ],
    },
    {
        header: 'Examples',
        content: [
            {
                example: '$ s exec -- build local',
            },
            {
                example: '$ s exec -- build docker',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSx1QkFBdUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRWhFLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFdkMsUUFBQSxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBQ3JCLFFBQUEsWUFBWSxHQUFHLFVBQVUsQ0FBQztBQUUxQixRQUFBLElBQUksR0FBRztJQUNsQjtRQUNFLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVBQVUsRUFBRTtZQUNWO2dCQUNFLElBQUksRUFBRSxZQUFZO2dCQUNsQixXQUFXLEVBQUUsa0JBQWtCO2dCQUMvQixLQUFLLEVBQUUsR0FBRztnQkFDVixhQUFhLEVBQUUsS0FBSztnQkFDcEIsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixLQUFLLEVBQUUsR0FBRztnQkFDVixJQUFJLEVBQUUsT0FBTzthQUNkO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsT0FBTyxFQUFFLHlCQUF5QjthQUNuQztZQUNEO2dCQUNFLE9BQU8sRUFBRSwwQkFBMEI7YUFDcEM7U0FDRjtLQUNGO0NBQ0YsQ0FBQyJ9