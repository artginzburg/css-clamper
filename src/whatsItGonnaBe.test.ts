import { describe, expect, test } from '@jest/globals';

import { clampify } from './index.js';
import { AbsoluteUnitValue, buildCssClamp, parseUnitValue, toPx } from './internals.js';

describe('what is it gonna be on viewport', () => {
  test('predicts from pixel values', () => {
    expect(whatsItGonnaBe(clampify('16px', '24px'), '5000px')).toBe(24);
    expect(whatsItGonnaBe(clampify('16px', '24px'), `${(1920 - 320) / 2 + 320}px`)).toBe(20);
    expect(whatsItGonnaBe(clampify('16px', '24px'), '100px')).toBe(16);
  });
});

function whatsItGonnaBe(cssClamp: ReturnType<typeof buildCssClamp>, onViewport: AbsoluteUnitValue) {
  const [min, preferred, max] = cssClamp.slice('clamp('.length, -1).split(', ');

  const minPx = toPx(min);
  const maxPx = toPx(max);

  let [preferredAbsolute, preferredAdaptive] = preferred.split(' + ');
  if (!preferredAdaptive) {
    preferredAdaptive = preferredAbsolute;
    preferredAbsolute = '0px';
  }

  const preferredAbsolutePx = toPx(preferredAbsolute);

  const preferredAdaptivePx = (parseUnitValue(preferredAdaptive).num * toPx(onViewport)) / 100;

  const preferredTotalAbsolute = preferredAbsolutePx + preferredAdaptivePx;

  const result = Math.min(maxPx, Math.max(minPx, preferredTotalAbsolute));

  return result;
}
