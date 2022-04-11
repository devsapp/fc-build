import { fse, lodash } from '@serverless-devs/core';
import { logger } from '@serverless-devs/core/dist/logger';
import * as os from 'os';
import path from 'path';
import random from 'string-random';

const { ROAClient } = require('@alicloud/pop-core');

function getAcrClient(region, credentials) {
  // console.log(`getAcrClient: ${ JSON.stringify(credentials)} ; region: ${region}`);
  const acrClient = new ROAClient({
    accessKeyId: credentials?.AccessKeyID,
    accessKeySecret: credentials?.AccessKeySecret,
    securityToken: credentials?.SecurityToken,
    endpoint: `https://cr.${region}.aliyuncs.com`,
    apiVersion: '2016-06-07',
  });
  return acrClient;
}

async function getAuthorizationToken(region, credentials): Promise<any> {
  const httpMethod = 'GET';
  const uriPath = '/tokens';
  const queries: any = {};
  const body = '';
  const headers: any = {
    'Content-Type': 'application/json',
  };
  const requestOption = {};
  const acrClient = getAcrClient(region, credentials);
  const response = await acrClient.request(httpMethod, uriPath, queries, body, headers, requestOption);

  return {
    dockerTmpUser: response?.data?.tempUserName,
    dockerTmpToken: response?.data?.authorizationToken,
  };
}

async function createUserInfo(region, credentials, pwd: string): Promise<any> {
  const httpMethod = 'PUT';
  const uriPath = '/users';
  const queries = {};
  const body = JSON.stringify({
    User: {
      Password: pwd,
    },
  });
  const headers = {
    'Content-Type': 'application/json',
  };
  const requestOption = {};
  const acrClient = getAcrClient(region, credentials);
  await acrClient.request(httpMethod, uriPath, queries, body, headers, requestOption);
}

async function getAuthorizationTokenOfRegisrty(region, credentials): Promise<any> {
  let response;
  try {
    response = await getAuthorizationToken(region, credentials);
  } catch (e) {
    if (
      e.statusCode === 404 &&
      e.result?.message === 'user is not exist.' &&
      e.result?.code === 'USER_NOT_EXIST'
    ) {
      // 子账号第一次需要先设置 Regisrty 的登陆密码后才能获取登录 Registry 的临时账号和临时密码
      // acr 密码要求: 8-32位，必须包含字母、符号或数字中的至少两项
      // 这里默认 uid:region:random(4) 生成一个初始密码
      const pwd = `${credentials.AccountID}_${random(4)}`;
      logger.info(`Aliyun ACR need the sub account to set password(init is ${pwd}) for logging in the registry https://cr.${region}.aliyuncs.com first if you want fc component to push image automatically`);
      await createUserInfo(region, credentials, pwd);
      response = await getAuthorizationToken(region, credentials);
    } else {
      console.log('getAuthorizationToken error');
      throw e;
    }
  }
  return response;
}


async function getDockerConfigInformation() {
  // https://docs.docker.com/engine/reference/commandline/cli/
  // In general, it will use $HOME/.docker/config.json if the DOCKER_CONFIG environment variable is not specified,
  // and use $DOCKER_CONFIG/config.json otherwise.
  let dockerConfigPath = path.join(os.homedir(), '.docker', 'config.json');
  if (process.env.DOCKER_CONFIG) {
    dockerConfigPath = path.join(process.env.DOCKER_CONFIG, 'config.json');
  }
  console.log(`dockerConfigPath: ${dockerConfigPath}`);

  let fileContent = {};
  try {
    fileContent = await fse.readJSON(dockerConfigPath);
  } catch (e) {
    if (!e.message.includes('no such file or directory')) {
      throw e;
    }
  }
  return {
    fileContent,
    dockerConfigPath,
  };
}

async function setDockerConfigInformation(dockerConfigPath, fileContent, image, auth) {
  if (lodash.get(fileContent, `auths.${image}`)) {
    fileContent.auths[image].auth = auth;
  } else if (lodash.get(fileContent, 'auths')) {
    fileContent.auths[image] = { auth };
  } else {
    fileContent = {
      auths: { [image]: { auth } },
    };
  }

  // console.log('fileContent::: ', JSON.stringify(fileContent, null, 2));
  await fse.outputFile(dockerConfigPath, JSON.stringify(fileContent, null, 2));
}

export async function mockDockerConfigFile(region, imageName, credentials) {
  const {
    fileContent,
    dockerConfigPath,
  } = await getDockerConfigInformation();
  const { dockerTmpUser, dockerTmpToken } = await getAuthorizationTokenOfRegisrty(region, credentials);
  const auth = Buffer.from(`${dockerTmpUser}:${dockerTmpToken}`).toString('base64');

  await setDockerConfigInformation(dockerConfigPath, fileContent, imageName.split('/')[0], auth);
}
