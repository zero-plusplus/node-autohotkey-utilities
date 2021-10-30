import * as path from 'path';
import { readFileSync } from 'fs';
import { AhkVersion } from './AhkVersion';
import { IncludePathResolver, SupportVariables, defaultSupportVariables } from './IncludePathResolver';
import insensitiveUniq from '../util/insensitiveUniq';
import { isDirExist, isPathExist } from '../util/file';


export interface IncludeInfo {
  readonly isOptional: boolean;
  readonly isLibraryMode: boolean;
  readonly isAgainMode: boolean;
  readonly path: string;
}

export class IncludePathExtractor {
  public readonly version: AhkVersion;
  public readonly resolver: IncludePathResolver;
  constructor(version: AhkVersion) {
    this.version = version;
    this.resolver = new IncludePathResolver(version);
  }
  /**
   * @param libraryTypes
   */
  public extract(rootPath: string, overwriteVariables?: Partial<SupportVariables>): string[] {
    const variables = {
      ...defaultSupportVariables,
      ...overwriteVariables,
      A_LineFile: rootPath,
    };
    if (!variables.A_ScriptDir || !variables.A_WorkingDir) {
      variables.A_ScriptDir = path.dirname(rootPath);
      variables.A_WorkingDir = variables.A_ScriptDir;
    }

    const source = readFileSync(rootPath, 'utf-8');
    const includeLinesMatch = [ ...source.matchAll(/^(?<!;)(\s*)#Include(?:|(?<isAgainMode>Again))\s+(?:|(?<isOptional>[*]i)\s+)(?:(?<includePath>[^*\s\r\n<>]+)|<(?<libraryPath>[^*\s\r\n<>]+)>)\s*/gium) ];
    const extractedIncludePathList: string[] = [];
    for (const includeLineMatch of includeLinesMatch) {
      const { isAgainMode, isOptional, includePath, libraryPath } = includeLineMatch.groups!;
      const includeInfo: IncludeInfo = {
        isAgainMode: Boolean(isAgainMode),
        isLibraryMode: Boolean(libraryPath),
        isOptional: Boolean(isOptional),
        path: libraryPath || includePath,
      };

      const resolvedPath = this.resolver.resolve(includeInfo.isLibraryMode ? `<${includeInfo.path}>` : includeInfo.path, variables);
      if (!resolvedPath) {
        continue;
      }

      if (isDirExist(resolvedPath)) {
        variables.PseudoVariable_IncludeBaseDir = resolvedPath;
        continue;
      }
      if (isPathExist(resolvedPath)) {
        extractedIncludePathList.push(resolvedPath);
        extractedIncludePathList.push(...(this.extract(resolvedPath, variables)));
      }
    }
    return insensitiveUniq(extractedIncludePathList);
  }
}
