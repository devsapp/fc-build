import { commandParse, lodash as _ } from '@serverless-devs/core';
import logger from './common/logger';

const APTS = {
  string: ['dockerfile', 'custom-env', 'custom-args'],
  boolean: ['help', 'use-sandbox', 'use-docker', 'use-buildkit', 'clean-useless-image'],
  alias: { dockerfile: 'f', 'use-docker': 'd', help: 'h' },
};

export default (inputs: any, complexParames: string[] = []) => {
  const { argsObj } = inputs;
  if (_.isEmpty(argsObj) || _.isEmpty(complexParames)) {
    return commandParse(inputs, APTS).data || {};
  }

  const complex: any = {};
  for (const complexParame of complexParames) {
    const inputsKey = `--${complexParame}`; // --custom-args
    const inputsQqualKey = `--${complexParame}=`; // --custom-args=
    if (argsObj.includes(inputsKey)) {
      const complexKeyIndex = argsObj.indexOf(inputsKey);
      complex[complexParame] = argsObj[complexKeyIndex + 1];

      argsObj.splice(complexKeyIndex, 2);
    } else if (argsObj.includes(inputsQqualKey)) {
      const complexKeyIndex = argsObj.indexOf(inputsQqualKey);
      complex[complexParame] = argsObj[complexKeyIndex].replace(inputsQqualKey, '');

      argsObj.splice(complexKeyIndex, 1);
    }
  }
  // @ts-ignore
  const argsData = commandParse({ argsObj }, APTS).data || {};

  const argsPayload = { ...argsData, ...complex };
  logger.debug(`argsPayload: ${JSON.stringify(argsPayload)}`);

  return argsPayload;
};
