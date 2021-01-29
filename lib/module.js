const { resolve, join } = require('path')
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

    /** If set, the non-preloads (prefetches) in Lighthouse are disabled (ignored). */
    ignoreLighthouse: false,

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
      return `~${file}`
    },
    /**
     * JS `require` Font-Path Resolver
     */
    requirePathResolve: p => p,

    ...this.options['nuxt-font-loader-strategy'],
    ...moduleOptions
  }

  addTemplates(this, await prepareFonts(options, file => filepathNormalizer(this.nuxt, file, filepath => options.importPathResolve(filepath))), options)
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
    src: resolve(__dirname, 'utils/index.js'),
    fileName: 'nuxt-font-loader-strategy/utils/index.js',
    options: { }
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
    return result.replace(`"${source.path}"`, filepathNormalizer(moduleScope, source.path, filepath => `require('${filepath}')`, '"'))
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
        ignoreLighthouse: options.ignoreLighthouse,
        unlockDelay: options.unlockDelay,
        prefetchCount: options.prefetchCount
      }
    })
  })
}

module.exports.meta = require('../package.json')

function filepathNormalizer (nuxt, filepath, resolve = f => f, quotes = '') {
  const addQuotes = value => `${quotes}${value}${quotes}`
  if (filepath.startsWith('/')) {
    // local filepath with router base (static dir)
    return addQuotes(join(nuxt.options.router.base + filepath).replace(/^\/\//, '/'))
  } else if (/^(ht|f)tp(s?):\/\//.test(filepath) || filepath.startsWith('//')) {
    // url filepath
    return addQuotes(filepath)
  } else {
    return resolve(filepath)
  }
}

module.exports.meta = require('../package.json')
