import { describe, expect, test } from '@jest/globals';

import { clampify, createClamper } from './';

describe('interpolate with default viewport', () => {
  test('calculates pixel values', () => {
    testClampify('16px', '24px', '(1rem, 0.9rem + 0.5vw, 1.5rem)');
    testClampify('16px', '96px', '(1rem, 5vw, 6rem)');
  });
  test('calculates rem values', () => {
    testClampify('1rem', '1.5rem', '(1rem, 0.9rem + 0.5vw, 1.5rem)');
    testClampify('1rem', '6rem', '(1rem, 5vw, 6rem)');
  });
  test('swaps params to go from max to min', () => {
    testClampify('16px', '5px', '(0.313rem, 1.137rem + -0.69vw, 1rem)');
  });
  test('calculates with negative values', () => {
    // TODO? swap values (back?) if they are negative. Otherwise, the final size just gets stuck with the maxValue, like clamp is not even here.
    testClampify('-200px', '-1px', '(-12.5rem, -14.988rem + 12.44vw, -0.063rem)');
    testClampify('-16px', '0px', '(-1rem, -1.2rem + 1vw, 0rem)'); // Here everything is OK already, but later...
    testClampify('-16px', '-1px', '(-1rem, -1.188rem + 0.94vw, -0.063rem)'); // as soon as we go from 0px to -1px — it works incorrectly.
  });
});

describe('parseUnitValue', () => {
  test('returns zeroes if provided with unsupported input (empty string)', () => {
    // @ts-expect-error specifically testing unsupported values.
    testClampify('', '', '(0rem, 0vw, 0rem)');
  });
});

describe('createClamper', () => {
  const clamperLikeDefault = createClamper('320px', '1920px');
  test('behaves like the default', () => {
    expect(clamperLikeDefault('16px', '24px')).toBe('clamp(1rem, 0.9rem + 0.5vw, 1.5rem)');
  });
});

function testClampify(minValue: Parameters<typeof clampify>[0], maxValue: Parameters<typeof clampify>[1], expected: `(${string}, ${string}, ${string})`) {
  const actual = clampify(minValue, maxValue);
  expect(actual).toBe(`clamp${expected}`);
}

/** Use just as you use `test` or `it`. Whenever you're going to implement the covered feature — just change `todo` to `it`. */
// function todo(testName: string, fn: Parameters<typeof test>[1], timeout?: number) {
//   test.todo(testName);
//   test.failing(`fail ${testName}`, fn, timeout);
// }
