[![build-test](./.github/badges/coverage.svg)](./.github/badges/coverage.svg)

## What?

Responsive sizes.

Set the minimum and maximum [font] sizes in `px` or `rem`. Same for viewport limits. The resulting size will scale proportionally to the client's viewport width, while staying within the specified limits.

For example, if the viewport is bounded from 320px to 1920px (default), and the size is limited from 16px to 32px, then when the client's window width is 1120px — the base size will be 24px.

## Why CSS-in-JS?

My last projects are 100% TypeScript. No CSS. No SCSS. Just [PostCSS][postcss] and [Browserslist][browserslist] under the hood. It is the best front-end decision I've made so far, and I believe modern front-end should be built this way.

## Where?

Use with CSS-in-JS libraries, like [styled-components](https://styled-components.com/).

## Performance

Please use Static Generation / SSR (bundled with Next.js), or [Babel macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) (bundled with CRA). Otherwise, all the calculations will run on your client's browser, impacting the load time (though the impact of this particular library is negligible).

## How?

The [`clampify()`](./src/index.ts#L47) function accepts `minSize`, `maxSize`, `minLimit`, `maxLimit` all of type RemOrPxValue (`${number}${'px' | 'rem'}`).

```js
import { clampify } from 'css-clamper';

const fontSizeResponsive = clampify('16px', '1.5rem');
// Outputs: clamp(1rem, 0.9rem + 0.5vw, 1.5rem)

const fontSizeMobileToTablet = clampify(
  '16px',
  '1.5rem',
  // By default, viewport is from 320 to 1920 pixels. Here's the override:
  '320px',
  '768px',
);
// Outputs: clamp(1rem, 0.643rem + 1.79vw, 1.5rem)
```

## Notes

- `clamp()` can be used with anything, not just `font-size`.
- You can swap `minSize` and `maxSize` to invert the responsiveness direction (max size on min viewport, min size on max viewport), e.g. for height tricks. This library takes care of that.
- `clamp()` accepts negative values, e.g. for margins or absolute positioning.

## Custom viewport limits

Imagine the UI designer provided you with Figma layouts where the minimum viewport is his phone size, and the maximum is his laptop size — 390px and 1512px — not the standard.

```js
// config/css-clamper.js
import { createClamper } from 'css-clamper';

export const clamper = createClamper('390px', '1512px');
```

Now use that `clamper()` function in your code. It is the same as putting the viewport limits in the 3rd and 4th parameters every time, but wrapped up for convenience.

> In the future, this library should be able to automatically scale the limits of your Figma layouts to match the standard viewport widths. This behavior will probably be opt-in. I'm also not sure about the maximum viewport limit since it's specific to whether the project should scale up for 4K and larger screens.

## Testing and maintaining

Refer to [docs/maintain.md](./docs/maintain.md)

## F.A.Q.

- Why not use `max(min())`? Why no fallback?

  Let [postcss-clamp](https://www.npmjs.com/package/postcss-clamp) think about that. Also, there are some powerful tools that take care of supporting older browsers. Like [Browserslist][browserslist], which is bundled into CRA and Next.js.

## References

- https://clamp.font-size.app - The most minimalistic Web app I've found that does this.
- https://npm.im/scss-slamp - The SCSS version. You should use it if your project is outdated in a way that it doesn't support CSS-in-JS well.
- https://npm.im/postcss-responsive - The PostCSS version.

- https://min-max-calculator.9elements.com — Another simplistic online demo (not as feature-rich).
- https://royalfig.github.io/fluid-typography-calculator/ — A reasonably good online demo.

## TODOs

- Add runtime warnings on incorrect values in dev mode

<!-- Link definitions: -->

[browserslist]: https://browsersl.ist
[postcss]: https://postcss.org
