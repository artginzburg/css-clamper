import { internalArrayAt } from './internalArrayAt';

const amountOfPxInRem = 16;
export const defaultFractionDigits = 3;

function isRem(value: string) {
  return value.endsWith('rem');
}

export function parseUnitValue(value: string) {
  const matched = value.match(/(-?[\d.]+)([a-z%]*)/);
  if (!matched) {
    return { unit: 'unknown', num: 0 };
  }
  const unit = internalArrayAt(matched, -1);
  const num = Number(internalArrayAt(matched, -2));
  return { unit, num };
}

export function numPxToRem(num: number) {
  return num / amountOfPxInRem;
}
function numRemToPx(num: number) {
  return num * amountOfPxInRem;
}

export function toRem(value: string) {
  return toFixedNumberDefault(
    isRem(value) ? parseUnitValue(value).num : numPxToRem(parseUnitValue(value).num),
  );
}
export function toPx(value: string) {
  return toFixedNumberDefault(
    isRem(value) ? numRemToPx(parseUnitValue(value).num) : parseUnitValue(value).num,
  );
}

/**
 * Use the default fraction digits to format the number, or return NaN if the value is not a number.
 *
 * - Previously had `?` (optional chaining operator) after `+value`, but this was removed due to the coverage report saying that it's an uncovered logic branch. The function is used in such conditions that would never allow for this logic branch to be covered.
 */
function toFixedNumberDefault(value: number) {
  return +value.toFixed(defaultFractionDigits);
}

export type AbsoluteUnitValue = `${number}${'px' | 'rem'}`;

type RemValue = `${number}rem`;
type VwValue = `${number}vw`;
type ClampPreferredValue = `${`${RemValue} + ` | ''}${VwValue}`;

export function buildCssClamp(min: RemValue, preferred: ClampPreferredValue, max: RemValue) {
  return `clamp(${min}, ${preferred}, ${max})` as const;
}
