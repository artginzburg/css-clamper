import { describe, expect, test } from '@jest/globals';

import { clampify } from './index.js';
import { AbsoluteUnitValue, buildCssClamp, parseUnitValue, toPx } from './internals.js';

describe('what is it gonna be on viewport', () => {
  test('predicts from pixel values', () => {
    expect(whatsItGonnaBe(clampify('16px', '24px'), '5000px')).toBe(24);
    expect(whatsItGonnaBe(clampify('16px', '24px'), `${(1920 - 320) / 2 + 320}px`)).toBe(20);
    expect(whatsItGonnaBe(clampify('16px', '24px'), '100px')).toBe(16);
  });

  test('predicts from extended clampers', () => {
    const initialMinSize = 18;
    const initialMaxSize = 30;
    const initialMinViewport = '390px';
    const initialMaxViewport = '1512px';
    const extendedMinViewport = '320px';
    const extendedMaxViewport = '1920px';
    const clampExtended = clampify(`${initialMinSize}px`, `${initialMaxSize}px`, initialMinViewport, initialMaxViewport, extendedMinViewport, extendedMaxViewport);
    // behaves correctly when the viewport is within the initial limits.
    expect(whatsItGonnaBe(clampExtended, initialMinViewport)).toBeCloseTo(initialMinSize);
    expect(whatsItGonnaBe(clampExtended, initialMaxViewport)).toBeCloseTo(initialMaxSize);

    // extends correctly when the viewport overflows the initial limits, but is in range of the extended viewport limits.
    expect(whatsItGonnaBe(clampExtended, '100px')).toBe(17.248);
    expect(whatsItGonnaBe(clampExtended, extendedMinViewport)).toBe(17.248); // tests that it works the same when exactly on the boundary and out of the boundary.
    expect(whatsItGonnaBe(clampExtended, '5000px')).toBe(34.368);
    expect(whatsItGonnaBe(clampExtended, extendedMaxViewport)).toBe(34.368); // tests that it works the same when exactly on the boundary and out of the boundary.
  })
});

/** @returns pixels as a number. */
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
