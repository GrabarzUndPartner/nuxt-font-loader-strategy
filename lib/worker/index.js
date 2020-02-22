import { resolve } from 'path'

export function addWebWorker (moduleScope, fonts, options) {
  const preparedFonts = prepareFonts(fonts)
  const workerData = prepareJSON(preparedFonts)

  moduleScope.extendBuild((config) => {
    config.module.rules.push({
      test: /\.font.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: {
          inline: true,
          fallback: true
        }
      }
    })
  })

  moduleScope.addTemplate({
    src: resolve(__dirname, 'preload.font.worker.js'),
    fileName: 'nuxt-font-loader-strategy/worker/preload.font.worker.js',
    options: Object.assign({}, options, {
    })
  })

  moduleScope.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-font-loader-strategy/worker/plugin.js',
    options: Object.assign({}, options, {
      publicPath: moduleScope.nuxt.options.build.publicPath,
      workerData
    }),
    ssr: false
  })
}

function prepareJSON (preparedFonts) {
  return preparedFonts.sources.reduce((result, source) => {
    result = result.replace(`"${source}"`, `require('${source}')`)
    return result
  }, JSON.stringify(preparedFonts))
}

function prepareFonts (fonts) {
  return fonts.filter(font => !font.preload).reduce((result, { sources }) => {
    result.sources.push(sources[0].path)
    return result
  }, {
    classes: fonts.map(font => font.classes).flat(),
    sources: []
  })
}
