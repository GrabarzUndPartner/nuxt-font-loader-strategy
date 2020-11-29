
export function arrayFlat (array) {
  if ('flat' in Array.prototype) {
    return array.flat()
  } else {
    return [].concat.apply([], array)
  }
}
