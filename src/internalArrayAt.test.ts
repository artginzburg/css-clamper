import { describe, expect, test } from '@jest/globals';
import { internalArrayAt } from './internalArrayAt';

describe('internalArrayAt', () => {
  const testArray = [...Array(10)].map((val, index) => index + 1);
  test('works with negative indexes', () => {
    expect(internalArrayAt(testArray, -1)).toBe(10);
    expect(internalArrayAt(testArray, -3)).toBe(8);
  })
  test('works with positive indexes', () => {
    expect(internalArrayAt(testArray, 1)).toBe(2);
    expect(internalArrayAt(testArray, 3)).toBe(4);
  })
})
