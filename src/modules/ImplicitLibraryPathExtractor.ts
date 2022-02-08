import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import { isDirExist } from '../util/file';
import { IncludePathExtractor } from './IncludePathExtractor';
import { SupportVariables, defaultSupportVariables, getLibraryDirList } from './IncludePathResolver';

export class ImplicitLibraryPathExtractor extends IncludePathExtractor {
  public extract(rootPathOrLoadedSources: string | string[], overwriteVariables?: Partial<SupportVariables>): string[] {
    if (2 < this.version.mejor) {
      return [];
    }

    const loadedScriptPathList = Array.isArray(rootPathOrLoadedSources) ? rootPathOrLoadedSources : [ rootPathOrLoadedSources, ...new IncludePathExtractor(this.version).extract(rootPathOrLoadedSources) ];
    const variables = {
      ...defaultSupportVariables,
      ...overwriteVariables,
    };
    const rootPath = loadedScriptPathList[0];
    if (!variables.A_ScriptDir) {
      variables.A_ScriptDir = path.dirname(rootPath);
    }
    if (!variables.A_WorkingDir) {
      variables.A_WorkingDir = variables.A_ScriptDir;
    }

    const libraryFilePathList = getLibraryDirList(variables)
      .flatMap((libraryDirPath) => (isDirExist(libraryDirPath) ? readdirSync(libraryDirPath) : []).map((libraryName) => path.resolve(`${libraryDirPath}/${libraryName}`)))
      .filter((libraryDirPath) => (/(?<=\\|\/)([\w_$#@]+)\.ahk$/ui).test(libraryDirPath));

    const implicitLibraryPathList: string[] = [];
    for (const filePath of loadedScriptPathList) {
      const source = readFileSync(filePath, 'utf-8')
        .replaceAll(/\/\*.*\*\//gu, ''); // Remove block comment

      for (const libraryFilePath of libraryFilePathList) {
        if (implicitLibraryPathList.includes(libraryFilePath)) {
          continue;
        }

        const libraryName = path.basename(libraryFilePath).replace(/\.ahk$/ui, '');
        const isCallImplictFunction = new RegExp(`(?<!;)\\s*${libraryName}(_[\\w_#@$]+)?\\(.*\\)`, 'ui').test(source);
        if (isCallImplictFunction) {
          implicitLibraryPathList.push(libraryFilePath);
        }
      }
    }
    return implicitLibraryPathList;
  }
}
