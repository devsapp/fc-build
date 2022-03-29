import { fse, lodash } from '@serverless-devs/core';
import * as os from 'os';
import path from 'path';

const { ROAClient } = require('@alicloud/pop-core');

async function getAuthorizationToken(region, credentials): Promise<any> {
  const httpMethod = 'GET';
  const uriPath = '/tokens';
  const queries: any = {};
  const body = '{}';
  const headers: any = {
    'Content-Type': 'application/json',
  };
  const requestOption = {};
  const acrClient = new ROAClient({
    accessKeyId: credentials?.AccessKeyID,
    accessKeySecret: credentials?.AccessKeySecret,
    securityToken: credentials?.SecurityToken,
    endpoint: `https://cr.${region}.aliyuncs.com`,
    apiVersion: '2016-06-07',
  });
  const response = await acrClient.request(httpMethod, uriPath, queries, body, headers, requestOption);

  return {
    dockerTmpUser: response?.data?.tempUserName,
    dockerTmpToken: response?.data?.authorizationToken,
  };
}

async function getDockerConfigInformation() {
  const dockerConfigPath = path.join(os.homedir(), '.docker', 'config.json');
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

  console.log('fileContent::: ', JSON.stringify(fileContent, null, 2));
  await fse.outputFile(dockerConfigPath, JSON.stringify(fileContent, null, 2));
}

export async function mockDockerConfigFile(region, imageName, credentials) {
  const {
    fileContent,
    dockerConfigPath,
  } = await getDockerConfigInformation();
  const { dockerTmpUser, dockerTmpToken } = await getAuthorizationToken(region, credentials);
  const auth = Buffer.from(`${dockerTmpUser}:${dockerTmpToken}`).toString('base64');

  await setDockerConfigInformation(dockerConfigPath, fileContent, imageName.split('/')[0], auth);
}
