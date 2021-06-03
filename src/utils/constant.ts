export const SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];

export const BUILDCOMMANDList = ['docker', 'local'];

export const CONTEXT = 'FC-BUILD';
export const CONTEXT_NAME = 'fc-build';

export const HELP = [
  {
    header: 'Options',
    optionList: [
      {
        name: 'dockerfile',
        description: '指定 dockerfile 路径',
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
        example: '$ s exec -- build local',
      },
      {
        example: '$ s exec -- build docker',
      },
    ],
  },
];
