
export const indent = (str: string, indent: string): string => {
  return `${indent}${str.replace(/(\r\n|(?<!\r)\n)/gu, `$1${indent}`)}`;
};
export const getIndent = (str: string): string => {
  const indentMatch = str.match(/^(\s*)/u);
  return indentMatch ? indentMatch[1] : '';
};
export const repeat = (str: string, count: number): string => {
  let repeated = '';
  for (let i = 0; i < count; i++) {
    repeated += str;
  }
  return repeated;
};
export const trimMargin = (template: TemplateStringsArray, ...substitutions: any[]): string => {
  const _trimMargin = (string: string, separator = '\\|'): string => {
    // Remove first spaces
    const lines = string.replace(/^(\r\n|\r|\n)/u, '').split('\n');

    const baseIndentSize = 0 < lines.length ? getIndent(lines[0]).length : 0;
    let trimmed = '';
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const currentIndentSize = getIndent(line).length;

      // Ignore last line spaces
      if (i + 1 === lines.length && currentIndentSize === line.length) {
        continue;
      }

      if (currentIndentSize < baseIndentSize) {
        line = `${repeat(' ', baseIndentSize)}${line}`;
      }

      const trimmedMargin = line.replace(new RegExp(`(^\\s*${separator}|^\\s{0,${baseIndentSize}})`, 'u'), '');
      trimmed += `${trimmedMargin}\n`;
    }
    trimmed = trimmed
      .replace(/\n$/u, '')
      .replace(/(?<=\n)\\s+$/u, '')
      .replace(/\\\\/gu, '\\');

    return trimmed;
  };

  const templated = String.raw(template, ...substitutions)
    .replace(/\\`/gu, '`');
  return _trimMargin(templated);
};

const bom = '\uFEFF';
export const addBom = (str: string): string => {
  return bom + str;
};
export const stripBom = (str: string): string => {
  return str.replace(new RegExp(`^${bom}`, 'u'), '');
};
export const toCrlf = (str: string): string => {
  return str.replace(/(?<!\r)\n/gu, '\r\n');
};
