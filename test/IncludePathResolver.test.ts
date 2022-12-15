import * as path from 'path';
import { AhkVersion, IncludePathResolver } from '../src';

const v1_1 = new AhkVersion('1.1.33.10');
const v2_0_b2 = new AhkVersion('2.0-beta.2');

describe('v1', () => {
  const rootDirPath = path.resolve(__dirname, 'sample', 'ahk');
  const rootPath = path.resolve(rootDirPath, 'main.ahk');

  test('IncludePathResolver', () => {
    const resolver = new IncludePathResolver(v1_1);
    expect(resolver.resolve('%A_LineFile%\\..\\main.ahk', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'main.ahk'));
    expect(resolver.resolve('.\\main.ahk', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'main.ahk'));
    expect(resolver.resolve('..\\main.ahk', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, '..', 'main.ahk'));
    expect(resolver.resolve('<LocalLibClass>', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'lib', 'LocalLibClass.ahk'));
    expect(resolver.resolve('<nestlib/NestLibFunction>', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'lib', 'nestlib', 'NestLibFunction.ahk'));
  });
});

describe('v2', () => {
  const rootDirPath = path.resolve(__dirname, 'sample', 'ahk2');
  const rootPath = path.resolve(rootDirPath, 'main.ahk2');

  test('IncludePathResolver', () => {
    const resolver = new IncludePathResolver(v2_0_b2);
    expect(resolver.resolve('%A_LineFile%\\..\\main.ahk2', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'main.ahk2'));
    expect(resolver.resolve('"%A_LineFile%\\..\\main.ahk2"', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'main.ahk2'));
    expect(resolver.resolve(`'%A_LineFile%\\..\\main.ahk2'`, { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'main.ahk2'));
    expect(resolver.resolve('.\\main.ahk2', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'main.ahk2'));
    expect(resolver.resolve('..\\main.ahk2', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, '..', 'main.ahk2'));
    expect(resolver.resolve('<LocalLibClass>', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'lib', 'LocalLibClass.ahk'));
    expect(resolver.resolve('<nestlib/NestLibFunction>', { A_LineFile: rootPath })).toEqual(path.resolve(rootDirPath, 'lib', 'nestlib', 'NestLibFunction.ahk'));
  });
});
