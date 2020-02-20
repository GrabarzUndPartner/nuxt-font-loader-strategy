self.addEventListener('message', ({ data }) => {
  const { sources, baseUrl, prefetchCount } = data
  prefetchSources(sources, { baseUrl, prefetchCount }).then(() => {
    self.postMessage({ prefetched: true })
  })
})

function prefetchSources (sources, options) {
  let prefetchCount = options.prefetchCount
  if (options.prefetchCount <= 0) {
    prefetchCount = sources.length
  }
  const range = sources.splice(0, Math.min(prefetchCount, sources.length))
  if (range.length) {
    return Promise.all(range.map(source => prefetchSource(source, options.baseUrl))).then(() => prefetchSources(sources, options))
  }
  return Promise.resolve()
}

function prefetchSource (source, baseUrl) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = resolve
    xhr.onerror = (err) => {
      throw err
    }
    xhr.open('GET', (baseUrl || '') + source, true)
    xhr.send()
  })
}
