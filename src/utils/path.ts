import path from 'path';

export function isNccPath(targetPath: string): boolean {
  return path.basename(targetPath) === 'dist';
}
