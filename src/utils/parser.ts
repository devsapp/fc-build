/* eslint-disable no-await-in-loop */

import _ from 'lodash';
import fs from 'fs-extra';
import { DockerfileParser } from 'dockerfile-ast';
import logger from '../common/logger';
import { resolveRuntimeToDockerImage } from './get-image-name';
import path from "path";
import {isNccPath} from "./utils";

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
export const IMAGE_VERSION = FC_DOCKER_VERSION || pkg['fc-docker'].version || '1.9.2';


const RESERVED_DOCKER_CMD = [
  'FROM', 'Add', 'ONBUILD',
  'ARG', 'CMD', 'ENTRYPOINT',
  'VOLUME', 'STOPSIGNAL'];

export async function funfileToDockerfile(funfilePath: string, runtime: string, serviceName: string, functionName: string) {
  const content = await fs.readFile(funfilePath, 'utf8');

  const funfile = DockerfileParser.parse(content);

  const dockerfile = [];

  for (const instruction of funfile.getInstructions()) {
    const ins = instruction.getInstruction();

    if (_.includes(RESERVED_DOCKER_CMD, ins)) {
      throw new Error(`Currently, Funfile does not support the semantics of '${ins}'.
If you have a requirement, you can submit the issue at https://github.com/devsapp/fc/issues.`);
    }

    if (ins.toUpperCase() === 'RUNTIME') {
      const runtimeArgs = instruction.getArguments();

      if (runtimeArgs.length !== 1) {
        throw new Error('invalid RUNTIME for Funfile');
      }

      const runtimeOfFunfile = runtimeArgs[0].getValue();

      if (runtimeOfFunfile !== runtime) {
        logger.warning(`\nDetectionWarning: The 'runtime' of '${serviceName}/${functionName}' in your yml is inconsistent with that in Funfile.`);
      }

      const imageName = await resolveRuntimeToDockerImage(runtimeOfFunfile);
      dockerfile.push(`FROM ${ imageName } as ${runtimeOfFunfile}`);
    } else {
      const range = instruction.getRange();
      // @ts-ignore: .
      dockerfile.push(instruction.getRangeContent(range));
    }
  }

  return dockerfile.join('\n');
}
