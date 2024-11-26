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

export function getPathToElement(element: any) {
  const path = []
  let currentElement = element

  while (currentElement.tagName.toLowerCase() !== 'body') {
    const parentNode = currentElement.parentNode
    const children = Array.from(parentNode.children)
    const nodeIndex = children.indexOf(currentElement) + 1
    const name = `${currentElement.tagName.toLowerCase()}:nth-child(${nodeIndex})`
    // 将当前元素的标签和其兄弟索引添加到路径数组中
    path.unshift(name)
    // 移动到父元素
    currentElement = parentNode
  }
  // 最后添加 body 标签
  path.unshift('body')

  return path.join(' > ')
}
