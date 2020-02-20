const { resolve } = require('path')
const { prepareFonts } = require('./utils/fontFace')
const { addWebWorker } = require('./worker')

const PATH_FONT_FACE_CSS = './font-face.css'

module.exports = async function (moduleOptions) {
  const options = {

    /**
     * Font css class pattern.
     * Example: '[family]_[variant]_[featureSettings]_[stretch]_[weight]_[style]'
     */
    classPattern: '[family]_[weight]_[style]',

    /** If set, the non-preloads are loaded via WebWorker. */
    useWorker: false,

    /**
     * List of excluded connection types.
     */
    ignoredEffectiveTypes: ['2g', 'slow-2g'],

    /**
     * Delay in milliseconds for unlock prefetched fonts.
     */
    unlockDelay: 0,

    /**
     * Defines how many fonts are prefetched at the same time.
     * Important: Lower than zero, everything is loaded at once.
     */
    prefetchCount: 2,

    /**
     * List of included fonts.
     */
    fonts: [],

    /**
     * CSS `@import` Font-Path Resolver
     */
    importPathResolve: (file) => {
      return file.replace(/^@\/(.*)$/, '~$1')
    },
    /**
     * JS `require` Font-Path Resolver
     */
    requirePathResolve: p => p,

    ...this.options['nuxt-font-loader-strategy'],
    ...moduleOptions
  }

  addTemplates(this, await prepareFonts(options, options.importPathResolve), options)
  addPlugins(this, await prepareFonts(options, options.requirePathResolve, false), options)

  if (options.useWorker) {
    addWebWorker(this, await prepareFonts(options, options.requirePathResolve, false), options)
  }
}

function addTemplates (moduleScope, fonts, options) {
  moduleScope.addTemplate({
    src: resolve(__dirname, 'font-face.css'),
    fileName: 'nuxt-font-loader-strategy/font-face.css',
    options: {
      fonts
    }
  })
  moduleScope.addTemplate({
    src: resolve(__dirname, 'utils/fontFace.js'),
    fileName: 'nuxt-font-loader-strategy/utils/fontFace.js',
    options: { }
  })
  moduleScope.addTemplate({
    src: resolve(__dirname, 'utils/fontLoader.js'),
    fileName: 'nuxt-font-loader-strategy/utils/fontLoader.js',
    options: { }
  })
}

function addPlugins (moduleScope, fonts, options) {
  const preparedFonts = fonts.map((font) => {
    return {
      preload: font.preload,
      source: font.sources[0],
      classes: font.classes
    }
  })
  const json = preparedFonts.reduce((result, { source }) => {
    return result.replace(`"${source.path}"`, `require('${source.path}')`)
  }, JSON.stringify(preparedFonts))
  moduleScope.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-font-loader-strategy/index.js',
    options: Object.assign({}, options, {
      isSPA: moduleScope.nuxt.options.mode === 'spa',
      fonts: json,
      fontFaceCSS: PATH_FONT_FACE_CSS,
      loadFontsOptions: {
        ignoredEffectiveTypes: options.ignoredEffectiveTypes,
        unlockDelay: options.unlockDelay,
        prefetchCount: options.prefetchCount
      }
    })
  })
}

module.exports.meta = require('../package.json')
