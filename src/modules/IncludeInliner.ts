import * as path from 'path';
import { readFileSync } from 'fs';
import { AhkVersion } from './AhkVersion';
import { IncludePathResolver, SupportVariables, defaultSupportVariables } from './IncludePathResolver';
import { addBom, indent as indentStr, stripBom, toCrlf } from '../util/string';
import { IncludeInfo } from './IncludePathExtractor';
import { isDirExist, isPathExist } from '../util/file';
import { ImplicitLibraryPathExtractor } from './ImplicitLibraryPathExtractor';

export class IncludeInliner {
  public readonly version: AhkVersion;
  private readonly resolver: IncludePathResolver;
  private readonly extractor: ImplicitLibraryPathExtractor;
  constructor(version: AhkVersion) {
    this.version = version;
    this.resolver = new IncludePathResolver(version);
    this.extractor = new ImplicitLibraryPathExtractor(version);
  }
  /**
   * @param libraryTypes
   */
  public exec(rootPath: string, overwriteVariables?: Partial<SupportVariables>, pathReplacer: (includeInfo: IncludeInfo) => string = (includeInfo): string => includeInfo.path): string {
    const variables = {
      ...defaultSupportVariables,
      ...overwriteVariables,
    };
    if (!variables.A_ScriptDir) {
      variables.A_ScriptDir = path.dirname(rootPath);
    }
    if (!variables.A_WorkingDir) {
      variables.A_WorkingDir = variables.A_ScriptDir;
    }

    const inline = (filePath: string, overwriteVariables?: Partial<SupportVariables>): string => {
      const variables = {
        ...defaultSupportVariables,
        ...overwriteVariables,
        A_LineFile: path.resolve(filePath),
      };

      const source = stripBom(readFileSync(filePath, 'utf-8'));
      return source.replace(/^(?<!;)(?<indent>[^\S\r\n]*)#Include(?:|(?<isAgainMode>Again))\s+(?:|(?<isOptional>[*]i)\s+)(?:(?<includePath>[^*\s\r\n<>]+)|<(?<libraryPath>[^*\s\r\n<>]+)>)[^\r\n\S]*(?<linebreak>\r\n|\n)?/gium, (...params) => {
        const { indent, isAgainMode, isOptional, includePath, libraryPath, linebreak } = params[params.length - 1]!;
        const includeInfo: IncludeInfo = {
          isAgainMode: Boolean(isAgainMode),
          isLibraryMode: Boolean(libraryPath),
          isOptional: Boolean(isOptional),
          path: libraryPath || includePath,
        };

        const resolvedPath = this.resolver.resolve(includeInfo.isLibraryMode ? `<${includeInfo.path}>` : includeInfo.path, variables);
        if (!resolvedPath) {
          throw Error(`File not found => "${includeInfo.path}"`);
        }

        if (isDirExist(resolvedPath)) {
          variables.PseudoVariable_IncludeBaseDir = resolvedPath;
          return '';
        }
        if (isPathExist(resolvedPath)) {
          const inlined = indentStr(inline(resolvedPath, variables), indent);
          return linebreak ? `${inlined}${String(linebreak)}` : inlined;
        }
        throw Error(`File not found => "${resolvedPath}"`);
      });
    };

    const inlinedSource = inline(rootPath, overwriteVariables);
    const implictFunctionPathList = this.extractor.extract(rootPath, variables);
    const implictFunctions = implictFunctionPathList.map((filePath) => {
      return stripBom(readFileSync(filePath, 'utf-8'));
    }).join('\r\n');
    const newSource = implictFunctions ? `${implictFunctions}\r\n${inlinedSource}` : inlinedSource;
    return toCrlf(addBom(newSource));
  }
}
