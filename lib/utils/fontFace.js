import { extname } from 'path'
import { paramCase, snakeCase } from 'change-case'
import { arrayFlat } from './index'

// Font-Face

const FONTFACE_PROPERTIES = {
  fontFamily: null,
  fontUnicodeRange: null,
  fontVariant: 'normal',
  fontFeatureSettings: 'normal',
  fontStretch: 'normal',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontDisplay: 'swap'
}

const DEFAULT_FONT_EXTENSIONS = ['woff2', 'woff']

const DEFAULT_CLASS_PATTERN = '[family]_[variant]_[featureSettings]_[stretch]_[weight]_[style]'

export function getFontClasses (pattern, set, properties) {
  pattern = pattern || DEFAULT_CLASS_PATTERN
  const className = Object.keys(properties).reduce((result, key) => {
    let name = key.replace(/^font/, '')
    name = name.replace(/^.{1}/, name[0].toLowerCase())
    let value = properties[String(key)]
    if (name === 'family') {
      value = set
    }
    result = result.replace(`[${name}]`, value)
    return result
  }, pattern)
  return [`font_${set}`, `font_${className}`]
}

export async function prepareFonts (options, resolve, kebabCaseProps = true) {
  const { fonts, classPattern } = options
  const preparedFonts = (await Promise.all(fonts.map((font) => {
    const fileExtensions = getFileExtensions(font)
    return font.fontFaces.map((face) => {
      const sources = prepareSrc(face.src, fileExtensions, resolve)
      const properties = getProperties(
        Object.assign({ fontFamily: `${font.fontFamily}` }, face),
        kebabCaseProps ? paramCase : name => name
      )
      const set = snakeCase(font.fontFamily)
      return {
        classes: getFontClasses(classPattern, set, properties),
        properties,
        sources,
        set,
        preload: face.preload || false,
        local: [].concat(face.local || [])
      }
    })
  })))
  return arrayFlat(preparedFonts)
}

export function createFontFace (font, baseUrl) {
  const props = font.properties
  const options = {
    display: props.fontDisplay,
    style: props.fontStyle,
    weight: props.fontWeight,
    unicodeRange: props.fontUnicodeRange,
    variant: props.fontVariant,
    featureSettings: props.fontFeatureSettings,
    stretch: props.fontStretch
  }
  const src = `url(${baseUrl + font.sources[0].path})`
  return new FontFace(props.fontFamily.replace(/'/g, ''), src, options)
}

function getFileExtensions (font) {
  if (Array.isArray(font.fileExtensions) && font.fileExtensions.length > 0) {
    return font.fileExtensions
  } else {
    return DEFAULT_FONT_EXTENSIONS
  }
}
function getFormat (path) {
  const ext = extname(path).replace(/^\./, '')

  switch (ext) {
    case 'ttf':
      return 'truetype'

    default:
      return ext
  }
}

function getProperties (face, transform = paramCase) {
  return Object.keys(FONTFACE_PROPERTIES).reduce((result, prop) => {
    const value = face[prop] || FONTFACE_PROPERTIES[prop]
    if (value) {
      result[transform(prop)] = value
    }
    return result
  }, {})
}

function prepareSrc (src, fileExtensions, pathResolve) {
  return fileExtensions.map((fileExtension) => {
    const filePath = src + '.' + fileExtension
    return {
      path: pathResolve(filePath),
      format: getFormat(filePath)
    }
  })
}
