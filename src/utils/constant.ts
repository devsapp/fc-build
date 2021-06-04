export const SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];

export const CONTEXT = 'FC-BUILD';
export const CONTEXT_NAME = 'fc-build';

export const HELP = [
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
