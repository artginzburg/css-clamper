import { describe, expect, test } from '@jest/globals';

import { clampify, createClamper } from './';

describe('interpolate with default viewport', () => {
  test('calculates pixel values', () => {
    expect(clampify('16px', '24px')).toBe('clamp(1rem, 0.9rem + 0.5vw, 1.5rem)');
    expect(clampify('16px', '96px')).toBe('clamp(1rem, 5vw, 6rem)');
  });
  test('calculates rem values', () => {
    expect(clampify('1rem', '1.5rem')).toBe('clamp(1rem, 0.9rem + 0.5vw, 1.5rem)');
    expect(clampify('1rem', '6rem')).toBe('clamp(1rem, 5vw, 6rem)');
  });
  test('swaps params to go from max to min', () => {
    expect(clampify('16px', '5px')).toBe('clamp(0.313rem, 1.137rem + -0.69vw, 1rem)');
  });
});

describe('parseUnitValue', () => {
  test('returns zeroes if provided with unsupported input (empty string)', () => {
    // @ts-expect-error specifically testing unsupported values.
    expect(clampify('', '')).toBe('clamp(0rem, 0vw, 0rem)');
  });
});

describe('createClamper', () => {
  const clamperLikeDefault = createClamper('320px', '1920px');
  test('behaves like the default', () => {
    expect(clamperLikeDefault('16px', '24px')).toBe('clamp(1rem, 0.9rem + 0.5vw, 1.5rem)');
  });
});

/** Use just as you use `test` or `it`. Whenever you're going to implement the covered feature — just change `todo` to `it`. */
// function todo(testName: string, fn: Parameters<typeof test>[1], timeout?: number) {
//   test.todo(testName);
//   test.failing(`fail ${testName}`, fn, timeout);
// }
