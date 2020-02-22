export function loadFonts (options) {
  options = Object.assign({
    ignoredEffectiveTypes: [],
    unlockDelay: 0,
    prefetchCount: 2
  }, options)

  if (isSlowConnection(options.ignoredEffectiveTypes)) { return }

  if (linkFeaturePreload() && linkFeaturePrefetch()) {
    const preloads = document.querySelectorAll('link[rel=\'delay-prefetch\']')
    if (preloads.length) {
      prefetchFonts(Array.from(preloads), options)
    }
  } else {
    // not supported features (prefetch or firefox with preload https://bugzilla.mozilla.org/show_bug.cgi?id=1405761)
    const links = getAllPrefetchPreloadLinks()
    const classList = Array.from(links).reduce((result, link) => result.concat(link.dataset.class.split(' ')), [])
    document.documentElement.classList.add(...classList)
  }
}

/**
 * Converts font list to HTML link tags.
 * @param Array fonts
 * @return Array
 */
export function fontsToLinks (fonts) {
  const attributes = {
    as: 'font',
    crossorigin: 'anonymous'
  }
  return fonts.map((font) => {
    const classes = font.classes
    const link = Object.assign({
      type: 'font/' + font.source.format,
      href: font.source.path,
      rel: font.preload ? 'preload' : 'delay-prefetch',
      'data-class': classes.join(' ')
      // INFO: Not supported variant & strecht
      // 'data-variant': props.fontVariant || 'normal',
      // 'data-stretch': props.fontStretch || 'normal',
    }, attributes)

    if (font.preload) {
      link.onload = 'document.documentElement.classList.add(' + classes.map(className => '\'' + className + '\'').join(',') + ');'
    }

    return link
  })
}

/**
 * Gets all "delay-prefetch" and "preload" link-tags contained in the DOM.
 * @return NodeList
 */
export function getAllPrefetchPreloadLinks () {
  return document.querySelectorAll('link[rel=\'delay-prefetch\'][as="font"],link[rel=\'preload\'][as="font"]')
}

/**
 * Checks if the user connection is slow.
 * @param Array ignoredEffectiveTypes
 * @return Boolean
 */
export function isSlowConnection (ignoredEffectiveTypes) {
  return navigator.connection && (ignoredEffectiveTypes.find(type => navigator.connection.effectiveType === type))
}

export function linkFeaturePrefetch () {
  const link = document.createElement('link')
  return link.relList && link.relList.supports('prefetch')
}

export function linkFeaturePreload () {
  const link = document.createElement('link')
  return link.relList && link.relList.supports('preload')
}

async function prefetchFonts (fonts, options, classList = []) {
  let prefetchCount = options.prefetchCount
  if (options.prefetchCount <= 0) {
    prefetchCount = fonts.length
  }
  const range = fonts.splice(0, Math.min(prefetchCount, fonts.length))
  if (range.length) {
    const list = await Promise.all(range.map(item => prefetchFont(item)))
    prefetchFonts(fonts, options, classList.concat(list))
  } else {
    unlockClasses(classList, options.unlockDelay)
  }
}

function arrayFlat (array) {
  if ('flat' in Array.prototype) {
    return array.flat()
  } else {
    return [].concat.apply([], array)
  }
}

export function unlockClasses (classList, unlockDelay) {
  const cb = () => {
    document.documentElement.classList.add(...arrayFlat(classList))
  }
  if (unlockDelay) {
    global.setTimeout(cb, unlockDelay)
  } else {
    cb()
  }
}

function prefetchFont (item) {
  return new Promise((resolve, reject) => {
    item.onload = e => resolve(e.target.dataset.class.split(' '))
    item.onerror = reject
    item.rel = 'prefetch'
  })
}
