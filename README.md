# nuxt-font-loader-strategy

## :warning: **This project is no longer maintained**, because the concept is not suitable for global management of many fonts in larger projects. For this reason we have developed a new concept that guarantees smart, efficient and performant component-based font management even in larger websites. Please visit: https://github.com/GrabarzUndPartner/nuxt-speedkit

[![Grabarz & Partner - Module][grabarz-partner-module-src]][grabarz-partner-href] 

[![Main][github-workflow-main-src]][github-workflow-main-href]

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Renovate - Status][renovate-status-src]][renovate-status-href]
[![License][license-src]][license-href]

> Helps to load the fonts and activate them by preloading.

`nuxt-font-loader-strategy` helps loading the fonts and provides a loading strategy based on preloads.

Define yourself which fonts will be unlocked first.  
This gives the best experience in the initial viewport of the website.

**Features:**
- Use preload to prevent font flashs.
- Generates the `@font-face` definitions automatically and includes them in the layout.  
- Increases the **Pagespeed Insight Score** 🎉
- Take the fonts from [Minimize critical request depth](https://web.dev/critical-request-chains/) and load them via `WebWorker`.
- Deactivate fonts at low connection. (Show [Browser-Support](#browser-support))

> ⚠️ Configuration of the fonts must be included only in the [**module settings**](#options).

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `nuxt-font-loader-strategy` dependency to your project

```bash
yarn add nuxt-font-loader-strategy # or npm install nuxt-font-loader-strategy
```

2. Add `nuxt-font-loader-strategy` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [

    ['nuxt-font-loader-strategy', { 
        ignoreLighthouse: true,
        ignoredEffectiveTypes: ['2g', 'slow-2g'],
        fonts: [
          // Font
          {
            fileExtensions: ['woff2', 'woff'],
            fontFamily: 'Font A',
            fontFaces: [
              // Font-Face
              {
                preload: true,
                localSrc: ['Font A', 'FontA-Regular'],
                src: '@/assets/fonts/font-a-regular',
                fontWeight: 400,
                fontStyle: 'normal'
              },
              // Font-Face
              {
                localSrc: ['Font A Light', 'FontA-Light'],
                src: '@/assets/fonts/font-a-300',
                fontWeight: 300,
                fontStyle: 'normal'
              },
              // Font-Face
              {
                localSrc: ['Font A Light Italic', 'FontA-LightItalic'],
                src: '@/assets/fonts/font-a-300Italic',
                fontWeight: 300,
                fontStyle: 'Italic'
              }
            ]
          },
          // Font
          {
            fileExtensions: ['woff2', 'woff'],
            fontFamily: 'Font B',
            fontFaces: [
              // Font-Face
              {
                preload: true,
                src: '@/assets/fonts/font-b-regular',
                fontWeight: 400,
                fontStyle: 'normal'
              },
              // Font-Face
              {
                src: '@/assets/fonts/font-b-700',
                fontWeight: 700,
                fontStyle: 'normal'
              }
            ]
          }
        ]
    }]

  ]
}
```
## Options

| Property                | Type       | Description                                                                                                               | Default                     |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `useWorker`             | `Boolean`  | If set, the non-preloads (prefetches) are loaded via WebWorker.                                                           | `false`                     |
| `ignoreLighthouse`      | `Boolean`  | If set, the non-preloads (prefetches) in Lighthouse are disabled (ignored).                                               | `false`                     |
| `classPattern`          | `Boolean`  | Font css class pattern.                                                                                                   | `[family]_[weight]_[style]` |
| `importPathResolve`     | `Function` | Path resolve for font `src: url(fontPath)`                                                                                | Replace `@/` to `~`         |
| `requirePathResolve`    | `Function` | Path resolve for `require(fontPath)`                                                                                      | no changes                  |
| `ignoredEffectiveTypes` | `Array`    | List of excluded connection types.                                                                                        | `[]`                        |
| `fonts`                 | `Array`    | List of included fonts.                                                                                                   | `[]`                        |
| `unlockDelay`           | `Number`   | Delay in milliseconds for unlock prefetched fonts.                                                                        | `0`                         |
| `prefetchCount`         | `Number`   | Defines how many fonts are prefetched at the same time. <br>**Important:** Lower than zero, everything is loaded at once. | `2`                         |



### Maximum expression `classPattern`

`[family]_[variant]_[featureSettings]_[stretch]_[weight]_[style]`

### WebWorker `useWorker`

Look for compactability at https://github.com/webpack-contrib/worker-loader.

WebWorker is executed with the setting `inline` to reduce the script loads.

### Font

| Property         | Type     | Description      | Default             |
| ---------------- | -------- | ---------------- | ------------------- |
| `fileExtensions` | `Array`  | Font-Family Name | `['woff2', 'woff']` |
| `fontFamily`     | `String` | Font-Family Name | `['2g', 'slow-2g']` |
| `fontFaces`      | `Array`  | Font-Faces       | `[]`                |

### Font-Face

| Property              | Type      | Description                                  | Default    |
| --------------------- | --------- | -------------------------------------------- | ---------- |
| `preload`             | `Boolean` | Specifies whether font is loaded as preload. | `false`    |
| `local`               | `Array`   | List of local font names (System, etc.).     | `[]`       |
| `src`                 | `Array`   | File Path without extension.                 | `null`     |
| `fontVariant`         | `String`  | CSS-Prop. `font-variant`                     | `'normal'` |
| `fontFeatureSettings` | `String`  | CSS-Prop. `font-feature-settings`            | `'normal'` |
| `fontStretch`         | `String`  | CSS-Prop. `font-stretch`                     | `'normal'` |
| `fontWeight`          | `Number`  | CSS-Prop. `font-weight`                      | `'normal'` |
| `fontStyle`           | `String`  | CSS-Prop. `font-style`                       | `'normal'` |
| `fontDisplay`         | `String`  | CSS-Prop. `font-display`                     | `'swap'`   |

>⚠️  **The first `fileExtensions` entry is used as `preload`.**

## Usage

On the HTML tag a class is set for each font file. This class then activates the set styles in the CSS.

The name of the font is specified in `SnakeCase`. (Example: `Open Sans` -> `open_sans`)

**It is recommended to normalize the used tags.**  

**Example:** `h1` has `font-weight: bold` as standard.


```css
p {
  font-family: sans-serif;
}

html.font_open_sans p {
  font-family: 'Roboto', sans-serif;
}
```

For additional FontFaces, classes switch with the options `weight` and `style`.

```CSS
p {
  font-family: sans-serif;
}

html.font_roboto_400_normal p.bold {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
}

p.bold {
  font-family: sans-serif;
  font-style: normal;
  font-weight: 700;
}

html.font_roboto_700_normal p.bold {
  font-family: 'Roboto', sans-serif;
}

p.light {
  font-family: sans-serif;
  font-style: normal;
  font-weight: 300;
}

html.font_roboto_300_normal p.light {
  font-family: 'Roboto', sans-serif;
}

p.italic {
  font-family: sans-serif;
  font-style: italic;
  font-weight: 400;
}

html.font_roboto_400_italic p.italic {
  font-family: 'Roboto', sans-serif;
}
```


## Browser Performance


![alt text][performance-image]

## Preview

- [Preview](https://grabarzundpartner.github.io/nuxt-font-loader-strategy/)
- [Report Client](https://grabarzundpartner.github.io/nuxt-font-loader-strategy/reports/webpack/client.html)
- [Report Modern](https://grabarzundpartner.github.io/nuxt-font-loader-strategy/reports/webpack/modern.html)
- [Report Server](https://grabarzundpartner.github.io/nuxt-font-loader-strategy/reports/webpack/server.html)


## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## Browser-Support

### Preload Fonts

The options `preload` and `prefetch` are required for the link tag.

**Not all browsers support this:**
- [Can I use - link-rel-preload](https://caniuse.com/#feat=link-rel-preload)
- [Can I use - link-rel-prefetch](https://caniuse.com/#feat=link-rel-prefetch)

If not supported, all fonts are activated.

### Deactivate fonts at low connection

Connection speed dependent font loading, requires the support of `navigator.connection.effectiveType`.

[Can I use - effectivetype](https://caniuse.com/#feat=mdn-api_networkinformation_effectivetype)

## License

[MIT License](./LICENSE)

<!-- Badges -->

[grabarz-partner-module-src]: <https://img.shields.io/badge/Grabarz%20&%20Partner-Module-d19700>
[grabarz-partner-href]: <https://grabarzundpartner.de>

[renovate-status-src]: <https://img.shields.io/badge/renovate-enabled-brightgreen>
[renovate-status-href]: <https://renovate.whitesourcesoftware.com/>

[github-workflow-main-src]: <https://github.com/GrabarzUndPartner/nuxt-font-loader-strategy/workflows/Main/badge.svg?branch=main>
[github-workflow-main-href]: <https://github.com/GrabarzUndPartner/nuxt-font-loader-strategy/actions?query=workflow%3AMain>

[npm-version-src]: https://img.shields.io/npm/v/nuxt-font-loader-strategy/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/nuxt-font-loader-strategy

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-font-loader-strategy.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-font-loader-strategy

[codecov-src]: https://img.shields.io/codecov/c/github/GrabarzUndPartner/nuxt-font-loader-strategy/branch/main/graph/badge.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/GrabarzUndPartner/nuxt-font-loader-strategy

[license-src]: https://img.shields.io/npm/l/nuxt-font-loader-strategy.svg?style=flat-square
[license-href]: https://npmjs.com/package/nuxt-font-loader-strategy


[performance-image]: ./example/static/performance.jpg

