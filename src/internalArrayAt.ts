export function internalArrayAt<T>(array: T[], index: number): T | undefined {
  return index < 0 ? array[array.length + index] : array[index];
}
