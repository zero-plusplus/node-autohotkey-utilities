import * as path from 'path';
import { SetRequired } from 'type-fest';
import { isPathExist } from '../util/file';
import { AhkVersion } from './AhkVersion';

/**
 * Library folder type.
 * @see https://www.autohotkey.com/docs/Functions.htm#lib
 * @see https://lexikos.github.io/v2/docs/Functions.htm#lib
 */
export type LibraryType = 'local' | 'user' | 'standard';
/**
 * List of built-in variables supported.
 * @see https://www.autohotkey.com/docs/commands/_Include.htm
 * @see https://lexikos.github.io/v2/docs/commands/_Include.htm
 */
export interface SupportVariables {
  /**
   * For non-compiled scripts: The full path and name of the EXE file that is actually running the current script. For example: `C:\Program Files\AutoHotkey\AutoHotkey.exe`
   *
   * For compiled scripts: The same as the above except the AutoHotkey directory is discovered via the registry entry HKLM\SOFTWARE\AutoHotkey\InstallDir. If there is no such entry, A_AhkPath is blank.
   */
  readonly A_AhkPath: string;
  /**
   * The full path and name of the folder containing the current user's application-specific data. For example: `C:\Users\<UserName>\AppData\Roaming`
   */
  readonly A_AppData: string;
  /**
   * The full path and name of the folder containing the all-users application-specific data. For example: `C:\ProgramData`
   */
  readonly A_AppDataCommon: string;
  /**
   * The name of the computer as seen on the network.
   */
  readonly A_ComputerName: string;
  /**
   * Contains the same string as the environment's ComSpec variable. Often used with Run/RunWait. For example: `C:\Windows\system32\cmd.exe`
   */
  readonly A_ComSpec: string;
  /**
   * The full path and name of the folder containing the current user's desktop files. For example: `C:\Users\<UserName>\Desktop`
   */
  readonly A_Desktop: string;
  /**
   * The full path and name of the folder containing the all-users desktop files. For example: `C:\Users\Public\Desktop`
   */
  readonly A_DesktopCommon: string;
  // A_IsCompiled // not support
  /**
   * Set automatically by AdditionalInfo. Normally you do not need to overwrite this variable.
   *
   * The full path and name of the file to which A_LineNumber belongs, which will be the same as A_ScriptFullPath unless the line belongs to one of a non-compiled script's #Include files.
   */
  readonly A_LineFile: string;
  /**
   * The full path and name of the current user's "My Documents" folder. Unlike most of the similar variables, if the folder is the root of a drive, the final backslash is not included (e.g. it would contain M: rather than M:\). For example: `C:\Users\<UserName>\Documents`
   */
  readonly A_MyDocuments: string;
  /**
   * The Program Files directory (e.g. `C:\Program Files or C:\Program Files (x86)`). This is usually the same as the ProgramFiles environment variable.
   *
   * On 64-bit systems (and not 32-bit systems), the following applies:
   * If the executable (EXE) that is running the script is 32-bit, A_ProgramFiles returns the path of the `Program Files (x86)` directory.
   * For 32-bit processes, the ProgramW6432 environment variable contains the path of the 64-bit Program Files directory. On Windows 7 and later, it is also set for 64-bit processes.
   * The ProgramFiles(x86) environment variable contains the path of the 32-bit Program Files directory.
   * [v1.0.43.08+]: The A_ prefix may be omitted, which helps ease the transition to #NoEnv.
   */
  readonly A_ProgramFiles: string;
  /**
   * The full path and name of the Programs folder in the current user's Start Menu. For example: `C:\Users\<UserName>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs`
   */
  readonly A_Programs: string;
  /**
   * The full path and name of the Programs folder in the all-users Start Menu. For example: `C:\ProgramData\Microsoft\Windows\Start Menu\Programs`
   */
  readonly A_ProgramsCommon: string;
  /**
   * Set automatically by AdditionalInfo. Normally you do not need to overwrite this variable.
   *
   * The full path of the directory where the current script is located. The final backslash is omitted (even for root directories).
   */
  readonly A_ScriptDir: string;
  /**
   * Set automatically by AdditionalInfo. Normally you do not need to overwrite this variable.
   *
   * The full path of the current script, e.g. `C:\My Documents\My Script.ahk`
   */
  readonly A_ScriptFullPath: string;
  /**
   * Set automatically by AdditionalInfo. Normally you do not need to overwrite this variable.
   *
   * The file name of the current script, without its path, e.g. `MyScript.ahk`
   */
  readonly A_ScriptName: string;
  /**
   * This variable contains a single space character.
   */
  readonly A_Space: ' ';
  /**
   * The full path and name of the current user's Start Menu folder. For example: `C:\Users\<UserName>\AppData\Roaming\Microsoft\Windows\Start Menu`
   */
  readonly A_StartMenu: string;
  /**
   * The full path and name of the all-users Start Menu folder. For example: `C:\ProgramData\Microsoft\Windows\Start Menu`
   */
  readonly A_StartMenuCommon: string;
  /**
   * The full path and name of the Startup folder in the current user's Start Menu. For example: `C:\Users\<UserName>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`
   */
  readonly A_Startup: string;
  /**
   * The full path and name of the Startup folder in the all-users Start Menu. For example: `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup`
   */
  readonly A_StartupCommon: string;
  /**
   * This variable contains a single tab character.
   */
  // eslint-disable-next-line no-tabs
  readonly A_Tab: '	';
  /**
   * The full path and name of the folder designated to hold temporary files. It is retrieved from one of the following locations (in order): 1) the environment variables TMP, TEMP, or USERPROFILE; 2) the Windows directory. For example: `C:\Users\<UserName>\AppData\Local\Temp`
   */
  readonly A_Temp: string;
  /**
   * The logon name of the user who launched this script.
   */
  readonly A_UserName: string;
  /**
   * The Windows directory. For example: `C:\Windows`
   */
  readonly A_WinDir: string;
  /**
   * Set automatically by AdditionalInfo. Normally you do not need to overwrite this variable.
   *
   * The full path of the directory where the current script is located. The final backslash is omitted (even for root directories).
   */
  readonly A_WorkingDir: string;
  /**
   * Pseudo-variable representing the base directory of the Include path; note that it does not exist in AutoHotkey.
   */
  readonly PseudoVariable_IncludeBaseDir: string;
}
export const defaultSupportVariables: SupportVariables = {
  A_AhkPath: '',
  A_AppData: String(process.env.APPDATA),
  A_AppDataCommon: String(process.env.ProgramData),
  A_ComputerName: String(process.env.COMPUTERNAME),
  A_ComSpec: String(process.env.ComSpec),
  A_Desktop: `${String(process.env.USERPROFILE)}\\Desktop`,
  A_DesktopCommon: `${String(process.env.PUBLIC)}\\Desktop`,
  A_LineFile: '',
  A_MyDocuments: `${String(process.env.USERPROFILE)}\\Documents`,
  A_ProgramFiles: String(process.env.ProgramFiles),
  A_Programs: `${String(process.env.APPDATA)}\\Microsoft\\Windows\\Start Menu\\Programs`,
  A_ProgramsCommon: `${String(process.env.ALLUSERSPROFILE)}\\Microsoft\\Windows\\Start Menu\\Programs`,
  A_ScriptDir: '',
  A_ScriptFullPath: '',
  A_ScriptName: '',
  A_Space: ' ',
  A_StartMenu: `${String(process.env.APPDATA)}\\Microsoft\\Windows\\Start Menu`,
  A_StartMenuCommon: `${String(process.env.ALLUSERSPROFILE)}\\Microsoft\\Windows\\Start Menu`,
  A_Startup: `${String(process.env.APPDATA)}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup`,
  A_StartupCommon: `${String(process.env.ALLUSERSPROFILE)}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup`,
  // eslint-disable-next-line no-tabs
  A_Tab: '	',
  A_Temp: String(process.env.TEMP),
  A_UserName: String(process.env.USERNAME),
  A_WinDir: String(process.env.SystemRoot),
  A_WorkingDir: '',
  PseudoVariable_IncludeBaseDir: '',
};

export const getLibraryDirList = (variables: SetRequired<Partial<SupportVariables>, 'A_ScriptDir'>): string[] => {
  const dirList = [
    path.resolve(variables.A_ScriptDir, 'lib'),
    variables.A_MyDocuments ? `${variables.A_MyDocuments}/AutoHotkey` : `${String(process.env.USERPROFILE)}/Documents/AutoHotkey/lib`,
  ];
  if (variables.A_AhkPath) {
    dirList.push(path.resolve(`${variables.A_AhkPath}/../lib`));
  }
  return dirList;
};

export const convertLibraryNameToPath = (libraryName: string, variables: SetRequired<Partial<SupportVariables>, 'A_ScriptDir'>): string | undefined => {
  const libraryDirPathList = getLibraryDirList(variables);

  for (const libraryDir of libraryDirPathList) {
    const libraryPath = path.resolve(libraryDir, `${libraryName}.ahk`);
    if (isPathExist(libraryPath)) {
      return libraryPath;
    }
  }
  return undefined;
};


export class IncludePathResolver {
  public readonly version: AhkVersion;
  constructor(version: AhkVersion) {
    this.version = version;
  }
  /**
   * Resolve so that the path that can be specified by `#Include` can be handled in JavaScript.
   * @param includePath For example: '%A_LineFile%\..\otherscript.ahk'
   */
  public resolve(includePath: string, supportVariables?: SetRequired<Partial<SupportVariables>, 'A_LineFile'>): string | undefined {
    const variables = {
      ...defaultSupportVariables,
      ...supportVariables,
    };
    if (!variables.A_ScriptDir) {
      variables.A_ScriptDir = path.dirname(variables.A_LineFile);
    }
    if (!variables.A_WorkingDir) {
      variables.A_WorkingDir = path.dirname(variables.A_LineFile);
    }

    if (includePath.startsWith('<') && includePath.endsWith('>')) {
      const libraryPath = convertLibraryNameToPath(includePath.slice(1, -1), variables);
      return libraryPath;
    }

    const deferencedPath = this.deference(includePath, variables);
    if (path.isAbsolute(deferencedPath)) {
      return path.resolve(deferencedPath);
    }
    if (supportVariables?.PseudoVariable_IncludeBaseDir) {
      return path.resolve(supportVariables.PseudoVariable_IncludeBaseDir, deferencedPath);
    }
    return 2 <= this.version.mejor ? path.resolve(variables.A_LineFile, '..', deferencedPath) : path.resolve(variables.A_ScriptDir, deferencedPath);
  }
  private deference(includePath: string, supportVariables: SupportVariables): string {
    return includePath.replace(/%(?<variableName>[^%\r\n]+)%/gu, (original, variableName): string => {
      if (Object.prototype.hasOwnProperty.call(supportVariables, variableName)) {
        return String(supportVariables[variableName]);
      }
      return original;
    });
  }
}
