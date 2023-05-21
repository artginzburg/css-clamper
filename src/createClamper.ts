import { clampify } from './clampify.js';
import type { AbsoluteUnitValue } from './internals.js';

/**
 * Predefine the viewport limits for your needs, and use the returned function in your code.
 *
 * It is the same as putting the viewport limits in the 3rd and 4th parameters of {@link clampify()} every time, but wrapped up for convenience.
 *
 * You can also predefine the extended viewport limits (a special feature that will be described in the ReadMe).
 *
 * @see https://github.com/artginzburg/css-clamper#custom-viewport-limits
 */
export function createClamper(
  minViewport: AbsoluteUnitValue,
  maxViewport: AbsoluteUnitValue
): (
  minValue: Parameters<typeof clampify>[0],
  maxValue: Parameters<typeof clampify>[1],
  extendMinViewport?: AbsoluteUnitValue,
  extendMaxViewport?: AbsoluteUnitValue
) => ReturnType<typeof clampify>;
export function createClamper(
  minViewport: AbsoluteUnitValue,
  maxViewport: AbsoluteUnitValue,
  extendMinViewport?: AbsoluteUnitValue,
  extendMaxViewport?: AbsoluteUnitValue
): (
  minValue: Parameters<typeof clampify>[0],
  maxValue: Parameters<typeof clampify>[1]
) => ReturnType<typeof clampify>;

export function createClamper(
  minViewport: AbsoluteUnitValue,
  maxViewport: AbsoluteUnitValue,
  extendMinViewport?: AbsoluteUnitValue,
  extendMaxViewport?: AbsoluteUnitValue
) {
  return extendMinViewport || extendMaxViewport
    ? function clamperExtended(
      minValue: Parameters<typeof clampify>[0],
      maxValue: Parameters<typeof clampify>[1]
    ) {
      return clampify(
        minValue,
        maxValue,
        minViewport,
        maxViewport,
        extendMinViewport,
        extendMaxViewport
      );
    }
    : function clamper(
      minValue: Parameters<typeof clampify>[0],
      maxValue: Parameters<typeof clampify>[1],
      extendMinViewport?: AbsoluteUnitValue,
      extendMaxViewport?: AbsoluteUnitValue
    ) {
      return clampify(
        minValue,
        maxValue,
        minViewport,
        maxViewport,
        extendMinViewport,
        extendMaxViewport
      );
    };
}
