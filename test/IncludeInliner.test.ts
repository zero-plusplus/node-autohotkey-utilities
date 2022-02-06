import * as path from 'path';
import { AhkVersion, IncludeInliner } from '../src';
import { addBom, toCrlf, trimMargin } from '../src/util/string';

const v1_1 = new AhkVersion('1.1.33.10');
// const v2_0_b2 = new AhkVersion('2.0-beta.2');
describe('v1', () => {
  const inliner = new IncludeInliner(v1_1);
  const rootDirPath = path.resolve(__dirname, 'sample', 'ahk');
  const rootPath = path.resolve(rootDirPath, 'otherscript.ahk');

  test('exec()', (): void => {
    const actual = inliner.exec(rootPath, { A_AhkPath: `${rootDirPath}/stdlib/dummy.exe` });
    const exptect = addBom(toCrlf(trimMargin`
      LocalLibFunction(a, b)
      {
          return a + b
      }
      LocalLibFunction_MsgBox(msg)
      {
          msgbox %msg%
      }
      LocalLibFunction_MsgBox("otherscript")
    `));
    expect(actual).toEqual(exptect);
  });
});
