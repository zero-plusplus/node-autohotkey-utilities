import * as path from 'path';
import { AhkVersion } from '../src';
import { IncludePathExtractor } from '../src/modules/IncludePathExtractor';

const v1_1 = new AhkVersion('1.1.33.10');
// const v2_0_b2 = new AhkVersion('2.0-beta.2');

describe('v1', () => {
  const rootDirPath = path.resolve(__dirname, 'sample', 'ahk');
  const rootPath = path.resolve(rootDirPath, 'main.ahk');
  const extractor = new IncludePathExtractor(v1_1);

  test('extract()', () => {
    expect(extractor.extract(rootPath)).toEqual([
      path.resolve(`${rootDirPath}/lib/LocalLibClass.ahk`),
      path.resolve(`${rootDirPath}/lib/LocalLibFunction.ahk`),
      path.resolve(`${rootDirPath}/otherscript.ahk`),
      path.resolve(`${rootDirPath}/otherscript2.ahk`),
      path.resolve(`${rootDirPath}/lib/nestlib/NestLibClass.ahk`),
      path.resolve(`${rootDirPath}/lib/nestlib/NestLibFunction.ahk`),
      path.resolve(`${rootDirPath}/lib/.DotLibFile.ahk`),
      path.resolve(`${rootDirPath}/.DotFile.ahk`),
    ]);
  });
});
