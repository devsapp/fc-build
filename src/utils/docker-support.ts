import { lodash as _ } from '@serverless-devs/core';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const defaultFileSharingPaths = ['/Users', '/Volumes', '/private', '/tmp'];

async function getSharedPathsOfDockerForMac(): Promise<string[]> {
  const settingsPath = path.join(
    os.homedir(),
    'Library/Group Containers/group.com.docker/settings.json',
  );

  const fileData = await fs.readFile(settingsPath, 'utf8');

  const settings = JSON.parse(fileData);

  if (Object.prototype.hasOwnProperty.call(settings, 'filesharingDirectories')) {
    return settings.filesharingDirectories;
  }
  return defaultFileSharingPaths;
}

export default async function findPathsOutofSharedPaths(mounts: any[]): Promise<any[]> {
  const dockerSharedPaths = await getSharedPathsOfDockerForMac();
  const pathsOutofSharedPaths = [];
  for (const mount of mounts) {
    if (_.isEmpty(mount)) {
      continue;
    }

    const mountPath = mount.Source;
    let isMountPathSharedToDocker = false;
    for (const dockerSharedPath of dockerSharedPaths) {
      if (mountPath.startsWith(dockerSharedPath)) {
        isMountPathSharedToDocker = true;
        break;
      }
    }
    if (!isMountPathSharedToDocker) {
      pathsOutofSharedPaths.push(mountPath);
    }
  }
  return pathsOutofSharedPaths;
}
