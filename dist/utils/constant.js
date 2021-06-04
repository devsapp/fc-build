"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.CONTEXT_NAME = exports.CONTEXT = exports.SUPPORTRUNTIMEBUILDList = void 0;
exports.SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];
exports.CONTEXT = 'FC-BUILD';
exports.CONTEXT_NAME = 'fc-build';
exports.HELP = [
    {
        header: 'Options',
        optionList: [
            {
                name: 'dockerfile',
                description: '指定 dockerfile 路径',
                alias: 'f',
                defaultOption: false,
                type: String,
            },
            {
                name: 'use-docker',
                description: '使用 docker 构建',
                alias: 'd',
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
                example: '$ s exec -- build --use-docker',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSx1QkFBdUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRWhFLFFBQUEsT0FBTyxHQUFHLFVBQVUsQ0FBQztBQUNyQixRQUFBLFlBQVksR0FBRyxVQUFVLENBQUM7QUFFMUIsUUFBQSxJQUFJLEdBQUc7SUFDbEI7UUFDRSxNQUFNLEVBQUUsU0FBUztRQUNqQixVQUFVLEVBQUU7WUFDVjtnQkFDRSxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsV0FBVyxFQUFFLGNBQWM7Z0JBQzNCLEtBQUssRUFBRSxHQUFHO2dCQUNWLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osV0FBVyxFQUFFLE1BQU07Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLElBQUksRUFBRSxPQUFPO2FBQ2Q7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxPQUFPLEVBQUUsZ0NBQWdDO2FBQzFDO1NBQ0Y7S0FDRjtDQUNGLENBQUMifQ==