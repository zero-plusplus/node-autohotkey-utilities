import * as fs from 'fs';

export const isDirExist = (filePath: string): boolean => {
  try {
    // eslint-disable-next-line no-sync
    const stat = fs.statSync(filePath);
    return stat.isDirectory();
  }
  catch (e: unknown) {
  }
  return false;
};
export const isPathExist = (filePath: string): boolean => {
  try {
    // eslint-disable-next-line no-sync
    fs.accessSync(filePath);
    return true;
  }
  catch (e: unknown) {
  }
  return false;
};
