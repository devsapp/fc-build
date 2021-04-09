"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.CONTEXT = exports.BUILDCOMMANDList = exports.SUPPORTRUNTIMEBUILDList = void 0;
exports.SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];
exports.BUILDCOMMANDList = ['docker', 'local'];
exports.CONTEXT = 'FC-BUILD';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSx1QkFBdUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRWhFLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFdkMsUUFBQSxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBRXJCLFFBQUEsSUFBSSxHQUFHO0lBQ2xCO1FBQ0UsTUFBTSxFQUFFLFNBQVM7UUFDakIsVUFBVSxFQUFFO1lBQ1Y7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFdBQVcsRUFBRSxrQkFBa0I7Z0JBQy9CLEtBQUssRUFBRSxHQUFHO2dCQUNWLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osV0FBVyxFQUFFLE1BQU07Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLElBQUksRUFBRSxPQUFPO2FBQ2Q7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxPQUFPLEVBQUUseUJBQXlCO2FBQ25DO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLDBCQUEwQjthQUNwQztTQUNGO0tBQ0Y7Q0FDRixDQUFDIn0=