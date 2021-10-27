type Version = `${number}-alpha` | `${number}.${number}.${number}` | `2.0-${'a' | 'beta.'}${number}` | AhkVersion;

export class AhkVersion {
  public readonly full: string;
  public readonly mejor: number = 0;
  public readonly minor: number = 0;
  public readonly patch: number = 0;
  public readonly alpha?: number;
  public readonly beta?: number;
  constructor(version: string) {
    const splitedVersion = version.split('.').map((part) => {
      const versionPart = parseInt(part, 10);
      if (isNaN(versionPart)) {
        return 0;
      }
      return versionPart;
    });

    this.full = version;
    this.mejor = parseFloat(`${splitedVersion[0]}.${splitedVersion[1]}`);

    const alphaMatch = version.match(/-(?:a(\d+)|alpha)/u);
    if (alphaMatch) {
      this.alpha = typeof alphaMatch[1] === 'undefined' ? 0 : parseInt(alphaMatch[1], 10); // Note: AutoHotkey_H does not have the alpha code set. It is always `2.0-alpha`
    }
    const betaMatch = version.match(/-(?:beta\.)(\d+)/u);
    if (betaMatch) {
      this.beta = typeof betaMatch[1] === 'undefined' ? 0 : parseInt(betaMatch[1], 10);
    }

    if (!this.alpha && !this.beta) {
      this.minor = splitedVersion[2] ?? 0;
      this.patch = splitedVersion[3] ?? 0;
    }
  }
  public static from(version: Version): AhkVersion {
    return typeof version === 'string' ? new AhkVersion(version) : version;
  }
  public static compare(a: Version, b: Version): number {
    return AhkVersion.from(a).compare(b);
  }
  public static greaterThan(a: Version, b: Version): boolean {
    return AhkVersion.from(a).greaterThan(b);
  }
  public static greaterThanEquals(a: Version, b: Version): boolean {
    return AhkVersion.from(a).greaterThanEquals(b);
  }
  public static lessThan(a: Version, b: Version): boolean {
    return AhkVersion.from(a).lessThan(b);
  }
  public static lessThanEquals(a: Version, b: Version): boolean {
    return AhkVersion.from(a).lessThanEquals(b);
  }
  public greaterThan(version: Version): boolean {
    return 0 < this.compare(version);
  }
  public greaterThanEquals(version: Version): boolean {
    return 0 <= this.compare(version);
  }
  public lessThan(version: Version): boolean {
    return this.compare(version) < 0;
  }
  public lessThanEquals(version: Version): boolean {
    return this.compare(version) <= 0;
  }
  public compare(target: Version): number {
    const targetVersion = typeof target === 'string' ? new AhkVersion(target) : target;

    if (this.mejor !== targetVersion.mejor) {
      return this.mejor - targetVersion.mejor;
    }
    if (this.minor !== targetVersion.minor) {
      return this.minor - targetVersion.minor;
    }
    if (this.patch !== targetVersion.patch) {
      return this.patch - targetVersion.patch;
    }
    if (typeof this.alpha === 'number' && typeof targetVersion.alpha === 'number') {
      return this.alpha - targetVersion.alpha;
    }
    if (typeof this.beta === 'number' && typeof targetVersion.beta === 'number') {
      return this.beta - targetVersion.beta;
    }
    if (typeof this.beta === 'number' && typeof targetVersion.alpha === 'number') {
      return 1;
    }
    if (typeof this.alpha === 'number' && typeof targetVersion.beta === 'number') {
      return -1;
    }
    return 0;
  }
}
