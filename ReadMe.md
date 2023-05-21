[![coverage](./.github/badges/coverage.svg)](https://github.com/artginzburg/css-clamper/actions/workflows/coverage.yml)
[![GitHub build and test Status](https://img.shields.io/github/actions/workflow/status/artginzburg/css-clamper/coverage.yml?label=build%20%26%20test)](https://github.com/artginzburg/css-clamper/actions/workflows/coverage.yml)
[![GitHub NPM Publish Status](https://img.shields.io/github/actions/workflow/status/artginzburg/css-clamper/publish.yml?label=publish)](https://github.com/artginzburg/css-clamper/actions/workflows/publish.yml)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/artginzburg/css-clamper)](https://github.com/artginzburg/css-clamper/issues/8)
[![wakatime](https://wakatime.com/badge/github/artginzburg/css-clamper.svg)](https://wakatime.com/badge/github/artginzburg/css-clamper)

# css-clamper

> Get a responsive size for anything CSS from a min and a max.

## Install

```sh
npm install css-clamper
```

## Usage

[`clampify()`][clampify()] accepts `minSize` and `maxSize` as numbers with `rem` or `px` units.

```js
import { clampify } from 'css-clamper';

const fontSizeResponsive = clampify('16px', '1.5rem');
//=> clamp(1rem, 0.9rem + 0.5vw, 1.5rem)
```

`minLimit` and `maxLimit` can be used to override the standard viewport.

```js
const fontSizeMobileToTablet = clampify(
  '16px',
  '1.5rem',
  // By default, viewport is from 320 to 1920 pixels. Here's the override:
  '320px',
  '768px',
);
//=> clamp(1rem, 0.643rem + 1.79vw, 1.5rem)
```

## What?

Responsive sizes.

Set the minimum and maximum [font] sizes in `px` or `rem`. Same for viewport limits. The resulting size will scale proportionally to the client's viewport width, while staying within the specified limits.

For example, if the viewport is bounded from 320px to 1920px (default), and the size is limited from 16px to 32px, then when the client's window width is 1120px — the base size will be 24px.

## Where?

Use with CSS-in-JS libraries, like [styled-components](https://styled-components.com/).

### Why CSS-in-JS?

My last projects are 100% TypeScript. No CSS. No SCSS. Just [PostCSS][postcss] and [Browserslist][browserslist] under the hood. It is the best front-end decision I've made so far, and I believe modern front-end should be built this way.

## Notes

- `clamp()` can be used with anything, not just `font-size`.
- You can swap `minSize` and `maxSize` to invert the responsiveness direction (max size on min viewport, min size on max viewport), e.g. for height tricks. This library takes care of that.
- `clamp()` accepts negative values, e.g. for margins or absolute positioning.

## Performance

Please use Static Generation / SSR (bundled with Next.js), or [Babel macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) (bundled with CRA). Otherwise, all the calculations will run on your client's browser, impacting the load time (though the impact of this particular library is negligible).

## Custom viewport limits

Imagine the UI designer provided you with Figma layouts where the minimum viewport is his phone size, and the maximum is his laptop size — 390px and 1512px — not the standard.

```js
// config/css-clamper.js
import { createClamper } from 'css-clamper';

export const clamper = createClamper('390px', '1512px');
```

Now use that `clamper()` function in your code. It is the same as putting the viewport limits in the 3rd and 4th parameters every time, but wrapped up for convenience.

> In the future, this library should be able to automatically scale the limits of your Figma layouts to match the standard viewport widths. This behavior will probably be opt-in. I'm also not sure about the maximum viewport limit since it's specific to whether the project should scale up for 4K and larger screens.

## Advanced usage

### Extending (scaling) viewport limits linearly

[`clampify()`][clampify()] also has the 5th and 6th parameters, `extendMinViewport` and `extendMaxViewport`. When specified, the sizes you specify will scale linearly, according to the relations between `minViewport` and `extendMinViewport`, as well as between `maxViewport` and `extendMaxViewport`.

How it works in a real example:

Suppose you're provided with non-standard sized layouts, like 390px for mobile and 1512px on desktop. But you want your adaptive layout to support a wider range of screen sizes, e.g. from 320px to 1920px (which `css-clamper` considers the standard, by the way). In the past, you would either ask the designer to adapt the layouts, or scale the sizes yourself using a calculator or an approximation. Now, you can do this:

```js
const fontSizeExtended = clampify(
  '16px',
  '24px',
  undefined, // assumed 320px
  undefined, // assumed 1920px
  '120px', // extendMinViewport
  '2120px', // extendMaxViewport
);
// Would output the same as this:
const fontSizeExtendedManually = clampify('15px', '25px', '120px', '2120px');

// Notice the difference in the initially specified sizes:
//   minSize — 16px vs 15px
//   maxSize — 24px vs 25px
```

You can create a clamper with the same concept:

```js
export const clamperExtended = createClamper(
  '390px', // Figma layout width for mobile
  '1512px', // Figma layout width for desktop
  '320px', // extendMinViewport — desired supported width for mobile
  '1920px', // extendMaxViewport — desired supported width for desktop
);
```

Now it's really simple for you to build fluid typography no matter if the initial layout was aware of the concept and was aware of the standard screen sizes.

To summarize, what you know is — on a screen 390px wide the heading font-size should be 18px, and on a screen 1512px wide the same font-size should be 30px. That's what you provide to the library, also specifying the requirement to support devices from 320px to 1920px in width. And it handles all the calculations for you!

> On 390px viewport, the font-size will still be 18px, and on 1512px it'll still be 30px, but on 320px, the font-size will become close to 17px, and on 1920px it'll be close to 34px.

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

<!-- Link definitions: -->

[browserslist]: https://browsersl.ist
[postcss]: https://postcss.org
[clampify()]: ./src/index.ts#L20
