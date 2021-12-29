import { isNccPath } from './path';
import path from 'path';

export const SUPPORTRUNTIMEBUILDList = ['nodejs', 'python', 'php', 'custom'];

export const CONTEXT = 'FC-BUILD';
export const CONTEXT_NAME = 'fc-build';

let pkg;
if (isNccPath(__dirname)) {
  // ncc compiler
  pkg = require(path.join(path.resolve(__dirname, '..'), 'package.json'));
} else {
  pkg = require(path.join(path.resolve(__dirname, '..', '..'), 'package.json'));
}

const { FC_DOCKER_VERSION } = process.env;
export const DEFAULT_REGISTRY = pkg['fc-docker'].registry_default || 'registry.hub.docker.com';
export const DOCKER_REGISTRIES = pkg['fc-docker'].registry_mirrors || ['registry.hub.docker.com'];
export const IMAGE_VERSION = FC_DOCKER_VERSION || pkg['fc-docker'].version || '1.10.0';

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
