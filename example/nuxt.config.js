const { resolve } = require('upath')
const isDev = process.env.NODE_ENV === 'development'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  dev: isDev,

  modern: isDev ? false : 'client',

  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,

  render: {
    resourceHints: false
  },

  env: {
    GITHUB_REPO_URL: `https://github.com/${process.env.GITHUB_REPOSITORY}`
  },

  build: {

    babel: {
      presets ({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app-edge'),
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    },

    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js'
    },

    postcss: {
      plugins: {
        'postcss-nesting': {}
      }
    },

    extend (config) {
      if (!isDev) {
        config.plugins.push(new BundleAnalyzerPlugin({
          reportFilename: resolve(`reports/webpack/${config.name}.html`),
          statsFilename: resolve(`reports/webpack/stats/${config.name}.json`),
          analyzerMode: 'static',
          generateStatsFile: true,
          openAnalyzer: false,
          logLevel: 'info',
          defaultSizes: 'gzip',
          statsOptions: 'normal'
        }))
      }
    }
  },

  generate: {
    dir: getDistPath()
  },

  router: {
    base: getBasePath()
  },

  modules: [
    [
      resolve(__dirname, '..'), {
        ignoreLighthouse: true,
        prefetchCount: 2,
        fonts: [
          {
            fileExtensions: ['woff2', 'woff'],
            fontFamily: 'Roboto',
            fontFaces: [
              {
                local: ['Roboto', 'Roboto-Regular'],
                src: '@/assets/fonts/roboto-v20-latin/roboto-v20-latin-regular',
                fontWeight: 400,
                fontStyle: 'normal'
              },
              {
                local: ['Roboto Light', 'Roboto-Light'],
                src: '@/assets/fonts/roboto-v20-latin/roboto-v20-latin-300',
                fontWeight: 300,
                fontStyle: 'normal'
              },
              {
                local: ['Roboto'],
                src: '@/assets/fonts/roboto-v20-latin/roboto-v20-latin-italic',
                fontWeight: 400,
                fontStyle: 'italic'
              },
              {
                local: ['Roboto Bold', 'Roboto-Bold'],
                src: '@/assets/fonts/roboto-v20-latin/roboto-v20-latin-700',
                fontWeight: 700,
                fontStyle: 'normal'
              }
            ]
          },
          {
            fileExtensions: ['woff2', 'woff'],
            fontFamily: 'Roboto Slab',
            fontFaces: [
              {
                preload: true,
                src: '@/assets/fonts/roboto-slab-v11-latin/roboto-slab-v11-latin-regular',
                fontWeight: 400,
                fontStyle: 'normal'
              },
              {
                preload: true,
                src: '@/assets/fonts/roboto-slab-v11-latin/roboto-slab-v11-latin-700',
                fontWeight: 700,
                fontStyle: 'normal'
              }
            ]
          }
        ]
      }
    ]
  ]
}

function getBasePath () {
  return process.env.npm_config_base || process.env.BASE_PATH || '/'
}

function getDistPath () {
  return process.env.npm_config_dist || process.env.DIST_PATH || 'dist'
}
