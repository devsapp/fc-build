import { DEFAULT_REGISTRY, IMAGE_VERSION } from './constant';
import { resolveDockerRegistry } from './docker-opts';


const runtimeImageMap = {
  nodejs6: 'nodejs6',
  nodejs8: 'nodejs8',
  nodejs10: 'nodejs10',
  nodejs12: 'nodejs12',
  nodejs14: 'nodejs14',
  'python2.7': 'python2.7',
  python3: 'python3.6',
  java8: 'java8',
  java11: 'java11',
  'php7.2': 'php7.2',
  'dotnetcore2.1': 'dotnetcore2.1',
  custom: 'custom',
};

export async function resolveRuntimeToDockerImage(runtime: string): Promise<string> {
  if (runtimeImageMap[runtime]) {
    const name = runtimeImageMap[runtime];
    const dockerImageRegistry = (await resolveDockerRegistry()) || DEFAULT_REGISTRY;
    const imageName = `${dockerImageRegistry}/aliyunfc/runtime-${name}:build-${IMAGE_VERSION}`;
    return imageName;
  }
  const errorMessage = `resolveRuntimeToDockerImage: invalid runtime name ${runtime}. Supported list: ${Object.keys(
    runtimeImageMap,
  )}`;

  throw new Error(errorMessage);
}
