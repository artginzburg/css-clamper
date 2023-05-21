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

    extendedMaxValuePx = extendSize(
      howViewportRelatesToSize,
      extendMaxViewport,
      maxViewportPx,
      maxValuePx,
    );
    extendedMinValuePx = extendSize(
      howViewportRelatesToSize,
      extendMinViewport,
      minViewportPx,
      minValuePx,
    );
  }

  return [extendedMinValuePx, extendedMaxValuePx];
}

function extendSize(
  howViewportRelatesToSize: number,
  extendViewportBorderTo: AbsoluteUnitValue | undefined,
  viewportBorderPx: number,
  sizeBorderPx: number,
) {
  if (!extendViewportBorderTo) return sizeBorderPx;

  const extendViewportPx = toPx(extendViewportBorderTo);
  const addedViewport = extendViewportPx - viewportBorderPx;
  const addedSize = addedViewport / howViewportRelatesToSize;
  const newSize = sizeBorderPx + addedSize;
  return newSize;
}
