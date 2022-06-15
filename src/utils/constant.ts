export const HELP = [
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


export const FC_BACKEND = 'fc-backend';

export const sourceActivate = {
  'python2.7': {
    PATH: '/usr/local/envs/py27/bin',
    CONDA_DEFAULT_ENV: 'py27',
  },
  python3: {
    PATH: '/usr/local/envs/py36/bin',
    CONDA_DEFAULT_ENV: 'py36',
  },
  'python3.9': {
    PATH: '/usr/local/envs/py39/bin',
    CONDA_DEFAULT_ENV: 'py39',
  },
  custom: {
    PATH: '/usr/local/envs/py37/bin',
    CONDA_DEFAULT_ENV: 'py37',
  },
};
