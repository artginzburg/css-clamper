function isRem(value: string) {
  return value.endsWith('rem');
}

function parseUnitValue(value: string) {
  const matched = value.match(/(-?[\d.]+)([a-z%]*)/);
  if (!matched) {
    return { unit: 'unknown', num: 0 };
  }
  const unit = matched.at(-1);
  const num = Number(matched.at(-2));
  return { unit, num };
}

const defaultFractionDigits = 3;

const amountOfPxInRem = 16;

function numPxToRem(num: number) {
  return num / amountOfPxInRem;
}
function numRemToPx(num: number) {
  return num * amountOfPxInRem;
}

function toRem(value: string) {
  return toFixedNumberDefault(
    isRem(value) ? parseUnitValue(value).num : numPxToRem(parseUnitValue(value).num),
  );
}
function toPx(value: string) {
  return toFixedNumberDefault(
    isRem(value) ? numRemToPx(parseUnitValue(value).num) : parseUnitValue(value).num,
  );
}

/**
 * Use the default fraction digits to format the number, or return NaN if the value is not a number.
 *
 * @todo Coverage shows that `?.` after `+value` is an uncovered logic branch. But there is no way to make this branch covered without exporting this function, just because of the context of where this function is used.
 */
function toFixedNumberDefault(value: number) {
  return +value?.toFixed(defaultFractionDigits);
}

type AbsoluteUnitValue = `${number}${'px' | 'rem'}`;

/**
 * As seen in https://min-max-calculator.9elements.com or https://royalfig.github.io/fluid-typography-calculator/
 */
export function clampify(
  minValue: AbsoluteUnitValue,
  maxValue: AbsoluteUnitValue,
  minViewport: AbsoluteUnitValue = '320px',
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

type RemValue = `${number}rem`;
type VwValue = `${number}vw`;
type ClampPreferredValue = `${`${RemValue} + ` | ''}${VwValue}`;

function buildCssClamp(min: RemValue, preferred: ClampPreferredValue, max: RemValue) {
  return `clamp(${min}, ${preferred}, ${max})` as const;
}

/**
 * "point" as in "after the decimal point"
 * @example 0.005 => 0.5
 */
function shiftDecimalPointRightByTwo(num: number) {
  return parseFloat((100 * num).toFixed(2));
}

export function createClamper(minViewport: AbsoluteUnitValue, maxViewport: AbsoluteUnitValue) {
  return function clamper(
    minValue: Parameters<typeof clampify>[0],
    maxValue: Parameters<typeof clampify>[1],
  ) {
    return clampify(minValue, maxValue, minViewport, maxViewport);
  };
}
