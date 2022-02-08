import * as path from 'path';
import { AhkVersion, ImplicitLibraryPathExtractor } from '../src';

const v1_1 = new AhkVersion('1.1.33.10');
// const v2_0_b2 = new AhkVersion('2.0-beta.2');
describe('v1', () => {
  const extractor = new ImplicitLibraryPathExtractor(v1_1);
  const rootDirPath = path.resolve(__dirname, 'sample', 'ahk');
  const rootPath = path.resolve(rootDirPath, 'main.ahk');

  test('extract()', (): void => {
    const actual = extractor.extract(rootPath, { A_AhkPath: `${rootDirPath}/stdlib/dummy.exe` });
    expect(actual).toEqual([
      path.resolve(rootDirPath, 'lib', 'ImplicitFunction.ahk'),
      path.resolve(rootDirPath, 'lib', 'LocalLibFunction.ahk'),
    ]);
  });
});
