import { describe, expect, test } from '@jest/globals';

import { clampify } from '../index.js';

describe('extend sizes to match arbitrary viewport limits', () => {
  test('extends', () => {
    expect(clampify('16px', '24px', undefined, undefined, '120px', '2120px')).toBe(
      clampify('15px', '25px', '120px', '2120px'),
    );
  });
  test('narrow (backwards)', () => {
    expect(clampify('16px', '24px', undefined, undefined, `${320 + 200}px`, `${1920 - 200}px`)).toBe(
      clampify('17px', '23px', `${320 + 200}px`, `${1920 - 200}px`),
    );
  })
});
