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
    customEnvs: [{ key: 'CONDA_DEFAULT_ENV', value: 'py27' }],
    cwdVersion: 'python -V',
  },
  python3: {
    PATH: '/usr/local/envs/py36/bin',
    customEnvs: [{ key: 'CONDA_DEFAULT_ENV', value: 'py36' }],
    cwdVersion: 'python -V',
  },
  'python3.9': {
    PATH: '/usr/local/envs/py39/bin',
    customEnvs: [{ key: 'CONDA_DEFAULT_ENV', value: 'py39' }],
    cwdVersion: 'python -V',
  },
  'python3.10': {
    PATH: '/usr/local/envs/py310/bin',
    customEnvs: [{ key: 'CONDA_DEFAULT_ENV', value: 'py310' }],
    cwdVersion: 'python -V',
  },
  nodejs12: {
    PATH: '/usr/local/versions/node/v12.22.12/bin',
    cwdVersion: 'node -v',
  },
  nodejs14: {
    PATH: '/usr/local/versions/node/v14.19.2/bin',
    cwdVersion: 'node -v',
  },
  nodejs16: {
    PATH: '/usr/local/versions/node/v16.15.0/bin',
    cwdVersion: 'node -v',
  },
  nodejs18: {
    PATH: '/usr/local/versions/node/v18.14.2/bin',
    cwdVersion: 'node -v',
  },
  custom: {
    PATH: '/usr/local/envs/py37/bin',
    CONDA_DEFAULT_ENV: 'py37',
    cwdVersion: 'python -V',
  },
};
