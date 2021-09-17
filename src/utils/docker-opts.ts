import { DEFAULT_REGISTRY, DOCKER_REGISTRIES } from './constant';
import * as httpx from 'httpx';

let DOCKER_REGISTRY_CACHE;

export async function resolveDockerRegistry() {
  if (DOCKER_REGISTRY_CACHE) {
    return DOCKER_REGISTRY_CACHE;
  }
  const promises = DOCKER_REGISTRIES.map((r) => httpx.request(`https://${r}/v2/aliyunfc/runtime-nodejs8/tags/list`, { timeout: 3000 }).then(() => r));
  try {
    DOCKER_REGISTRY_CACHE = await Promise.race(promises);
  } catch (error) {
    DOCKER_REGISTRY_CACHE = DEFAULT_REGISTRY;
  }
  return DOCKER_REGISTRY_CACHE;
}
