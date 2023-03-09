import {
  AbsoluteUnitValue,
  buildCssClamp,
  defaultFractionDigits,
  numPxToRem,
  toPx,
  toRem,
} from './internals';

/**
 * Set the minimum and maximum [font] sizes in `px` or `rem`.
 * Same for viewport limits (optional).
 * The resulting size will scale proportionally to the client's viewport width, while staying within the specified limits.
 *
 * For example, if the viewport is bounded from 320px to 1920px (default), and the size is limited from 16px to 32px, then when the client's window width is 1120px — the base size will be 24px.
 *
 * @see https://github.com/artginzburg/css-clamper#usage
 */
export function clampify(
  minValue: AbsoluteUnitValue,
  maxValue: AbsoluteUnitValue,
  /** Default: `320px` */
  minViewport: AbsoluteUnitValue = '320px',
  /** Default: `1920px` */
  maxViewport: AbsoluteUnitValue = '1920px',
) {
  const [minValuePx, maxValuePx, minViewportPx, maxViewportPx] = [
    minValue,
    maxValue,
    minViewport,
    maxViewport,
  ].map(toPx);

  const variablePart = (maxValuePx - minValuePx) / (maxViewportPx - minViewportPx);

  const constant = parseFloat(
    numPxToRem(maxValuePx - maxViewportPx * variablePart).toFixed(defaultFractionDigits),
  );

  /** Sorted values, so that the actual min and max are always at the start and the end respectively. Otherwise, `clamp()` stops working when values are swapped. */
  const [minValueWithRem, maxValueWithRem] = [minValue, maxValue]
    .map(toRem)
    .sort()
    .map((size) => `${size}rem` as const);

  const variablePartWithVw = `${shiftDecimalPointRightByTwo(variablePart)}vw` as const;

  return buildCssClamp(
    minValueWithRem,
    `${constant ? (`${constant}rem + ` as const) : ''}${variablePartWithVw}`,
    maxValueWithRem,
  );
}

/**
 * "point" as in "after the decimal point"
 * @example 0.005 => 0.5
 */
function shiftDecimalPointRightByTwo(num: number) {
  return parseFloat((100 * num).toFixed(2));
}

/**
 * Predefine the viewport limits for your needs, and use the returned function in your code.
 *
 * It is the same as putting the viewport limits in the 3rd and 4th parameters of {@link clampify()} every time, but wrapped up for convenience.
 *
 * @see https://github.com/artginzburg/css-clamper#custom-viewport-limits
 */
export function createClamper(minViewport: AbsoluteUnitValue, maxViewport: AbsoluteUnitValue) {
  return function clamper(
    minValue: Parameters<typeof clampify>[0],
    maxValue: Parameters<typeof clampify>[1],
  ) {
    return clampify(minValue, maxValue, minViewport, maxViewport);
  };
}
