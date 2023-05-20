import { AbsoluteUnitValue, toPx } from '../internals.js';

export function extendSizeInClampify(
  minValuePx: number,
  maxValuePx: number,
  minViewportPx: number,
  maxViewportPx: number,
  extendMinViewport: AbsoluteUnitValue | undefined,
  extendMaxViewport: AbsoluteUnitValue | undefined,
) {
  let [extendedMinValuePx, extendedMaxValuePx] = [minValuePx, maxValuePx];

  if (extendMinViewport || extendMaxViewport) {
    const howViewportRelatesToSize = (maxViewportPx - minViewportPx) / (maxValuePx - minValuePx);
    const newMaxSize = extendSize(
      howViewportRelatesToSize,
      extendMaxViewport,
      maxViewportPx,
      maxValuePx,
    );
    if (newMaxSize) {
      extendedMaxValuePx = newMaxSize;
    }
    const newMinSize = extendSize(
      howViewportRelatesToSize,
      extendMinViewport,
      minViewportPx,
      minValuePx,
    );
    if (newMinSize) {
      extendedMinValuePx = newMinSize;
    }
  }

  return [extendedMinValuePx, extendedMaxValuePx];
}

function extendSize(
  howViewportRelatesToSize: number,
  extendViewportBorderTo: AbsoluteUnitValue | undefined,
  viewportBorderPx: number,
  sizeBorderPx: number,
) {
  if (extendViewportBorderTo) {
    const extendMinViewportPx = toPx(extendViewportBorderTo);
    const addedMinViewport = extendMinViewportPx - viewportBorderPx;
    const addedSize = addedMinViewport / howViewportRelatesToSize;
    const newMinSize = sizeBorderPx + addedSize;
    return newMinSize;
  }
}
