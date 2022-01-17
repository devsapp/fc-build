import { loadComponent } from '@serverless-devs/core';

export async function resolveRuntimeToDockerImage(runtime: string): Promise<string> {
  const fcCore = await loadComponent('devsapp/fc-core');
  return await fcCore.resolveRuntimeToDockerImage?.(runtime, true);
}
