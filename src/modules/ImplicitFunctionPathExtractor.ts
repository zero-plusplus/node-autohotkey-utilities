import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import { isDirExist } from '../util/file';
import { IncludePathExtractor } from './IncludePathExtractor';
import { SupportVariables, defaultSupportVariables, getLibraryDirList } from './IncludePathResolver';

export class ImplicitFunctionPathExtractor extends IncludePathExtractor {
  public extract(filePath: string | string[], overwriteVariables?: Partial<SupportVariables>): string[] {
    if (2 < this.version.mejor) {
      return [];
    }

    const filePathList = Array.isArray(filePath) ? filePath : [ filePath, ...new IncludePathExtractor(this.version).extract(filePath) ];
    const variables = {
      ...defaultSupportVariables,
      ...overwriteVariables,
    };
    const rootPath = filePathList[0];
    if (!variables.A_ScriptDir) {
      variables.A_ScriptDir = path.dirname(rootPath);
    }
    if (!variables.A_WorkingDir) {
      variables.A_WorkingDir = variables.A_ScriptDir;
    }

    const implicitLibraryPathList: string[] = [];
    for (const libraryDirPath of getLibraryDirList(variables)) {
      if (!isDirExist(libraryDirPath)) {
        continue;
      }
      const libraryFilePathList = (readdirSync(libraryDirPath)).filter((file) => (/\.ahk$/iu).test(file));

      let libraryPath: string | undefined;
      for (const libraryFileName of libraryFilePathList) {
        const libraryNameMatch = libraryFileName.match(/^([\w_$#@]+)\.ahk$/iu);
        if (!libraryNameMatch) {
          continue;
        }
        const libraryName = libraryNameMatch[1];

        for (const filePath of filePathList) {
          const source = readFileSync(filePath, 'utf-8');
          const isCallImplictFunction = new RegExp(`${libraryName}(?:|_[^\\(\\)]+)\\(.*\\)`, 'ui').test(source);
          if (isCallImplictFunction) {
            libraryPath = path.resolve(libraryDirPath, libraryFileName);
            break;
          }
        }
      }

      if (libraryPath) {
        implicitLibraryPathList.push(libraryPath);
      }
    }
    return implicitLibraryPathList;
  }
}
