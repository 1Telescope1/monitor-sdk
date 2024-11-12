export function deepClone(obj: any, hash = new WeakMap()) {
  if (obj == null) {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj)
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }
  if (typeof obj === 'function') {
    return obj
  }
  if (typeof obj !== 'object') {
    return obj
  }
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  const cloneObj = new obj.constructor()
  hash.set(obj, cloneObj)
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
}

export function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
}
