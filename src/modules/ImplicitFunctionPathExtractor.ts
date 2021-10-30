import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import { IncludePathExtractor } from '..';
import { isDirExist } from '../util/file';
import { AhkVersion } from './AhkVersion';
import { SupportVariables, defaultSupportVariables, standardLibraryDir, userLibraryDir } from './IncludePathResolver';

export class ImplicitFunctionPathExtractor {
  public readonly version: AhkVersion;
  private readonly extractor: IncludePathExtractor;
  constructor(version: AhkVersion) {
    this.version = version;
    this.extractor = new IncludePathExtractor(version);
  }
  public extract(filePath: string | string[], overwriteVariables?: Partial<SupportVariables>): string[] {
    if (2 < this.version.mejor) {
      return [];
    }

    const filePathList = Array.isArray(filePath) ? filePath : [ filePath, ...this.extractor.extract(filePath) ];
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

    const libraryDirPathList = [ path.resolve(path.dirname(rootPath), 'lib'), userLibraryDir, standardLibraryDir ];

    const implicitLibraryPathList: string[] = [];
    for (const libraryDirPath of libraryDirPathList) {
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
