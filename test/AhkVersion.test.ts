import { AhkVersion } from '../src/modules/AhkVersion';

const v1_0 = new AhkVersion('1.0.48.05');
const v1_1 = new AhkVersion('1.1.33.10');
const v2_0 = new AhkVersion('2.0');
const v2_0_a138 = new AhkVersion('2.0-a138-7538f26f');
const v2_0_a = new AhkVersion('2.0-alpha');
const v2_0_b2 = new AhkVersion('2.0-beta.2');
const v2_0_rc2 = new AhkVersion('2.0-rc.2');

test('constructor', () => {
  const testVersion = (ver: AhkVersion, expectValues: { [key in keyof Pick<InstanceType<typeof AhkVersion>, 'mejor' | 'minor' | 'patch' | 'alpha' | 'beta'>]: number }): void => {
    Object.keys(expectValues).forEach((key) => {
      const expectValue = expectValues[key];
      if (typeof expectValue === 'number') {
        expect(ver[key]).toBe(expectValue);
      }
    });
  };
  testVersion(v1_0, { mejor: 1.0, minor: 48, patch: 5 });
  testVersion(v1_1, { mejor: 1.1, minor: 33, patch: 10 });
  testVersion(v2_0_a138, { mejor: 2.0, minor: 0, patch: 0, alpha: 138 });
  testVersion(v2_0_b2, { mejor: 2.0, minor: 0, patch: 0, beta: 2 });
  testVersion(v2_0_a, { mejor: 2.0, minor: 0, patch: 0, alpha: 0 });
});

test('compare', () => {
  expect(v1_0.compare(v1_1)).toBeLessThan(0);
  expect(v1_1.compare(v2_0_a)).toBeLessThan(0);
  expect(v1_1.compare(v2_0_a138)).toBeLessThan(0);
  expect(v1_1.compare(v2_0_b2)).toBeLessThan(0);
  expect(v2_0_a.compare(v2_0_a138)).toBeLessThan(0);
  expect(v2_0_a138.compare(v2_0_b2)).toBeLessThan(0);
  expect(v1_0.compare(v2_0_b2)).toBeLessThan(0);
  expect(v2_0_b2.compare(v2_0)).toBeLessThan(0);
});

test('greaterThan', () => {
  expect(v1_1.greaterThan(v1_0)).toBeTruthy();
  expect(v1_0.greaterThan(v1_0)).toBeFalsy();
  expect(v1_0.greaterThan(v1_1)).toBeFalsy();

  expect(v2_0_rc2.greaterThan(v2_0_a138)).toBeTruthy();
  expect(v2_0_rc2.greaterThan(v2_0_a)).toBeTruthy();
  expect(v2_0_rc2.greaterThan(v2_0_b2)).toBeTruthy();

  expect(v2_0_b2.greaterThan(v2_0_a138)).toBeTruthy();
  expect(v2_0_b2.greaterThan(v2_0_a)).toBeTruthy();
  expect(v2_0_b2.greaterThan(v2_0_a)).toBeTruthy();
});

test('greaterThanEquals', () => {
  expect(v1_0.greaterThanEquals(v1_1)).toBeFalsy();
  expect(v1_0.greaterThanEquals(v1_0)).not.toBeFalsy();
});

test('lessThan', () => {
  expect(v1_0.lessThan(v1_1)).toBeTruthy();
  expect(v1_0.lessThan(v1_0)).not.toBeTruthy();
  expect(v2_0_b2.lessThan(v1_0)).toBeFalsy();
  expect(v2_0.lessThan(v2_0_b2)).toBeFalsy();
});

test('lessThanEquals', () => {
  expect(v1_0.lessThanEquals(v1_1)).toBeTruthy();
  expect(v1_0.lessThanEquals(v1_0)).toBeTruthy();
});
