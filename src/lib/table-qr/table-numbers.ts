const DEFAULT_TABLE_PREFIX = "Table";

export function buildTableNumber(prefix: string | undefined, index: number): string {
  const trimmedPrefix = prefix?.trim() || DEFAULT_TABLE_PREFIX;
  return `${trimmedPrefix} ${index}`;
}

export function buildTableNumberRange(
  from: number,
  to: number,
  prefix?: string,
): string[] {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from > to) {
    return [];
  }

  const numbers: string[] = [];
  for (let index = from; index <= to; index += 1) {
    numbers.push(buildTableNumber(prefix, index));
  }
  return numbers;
}
