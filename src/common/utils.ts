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

// 解析错误堆栈
export function parseStackFrames(error: Error) {
  const { stack } = error
  // 正则表达式，用以解析堆栈split后得到的字符串
  const FULL_MATCH =
    /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i

  // 限制只追溯5个
  const STACKTRACE_LIMIT = 5

  // 解析每一行
  function parseStackLine(line: string) {
    const lineMatch = line.match(FULL_MATCH)
    if (!lineMatch) {
      return {}
    }
    const filename = lineMatch[2]
    const functionName = lineMatch[1] || ''
    const lineno = parseInt(lineMatch[3], 10) || undefined
    const colno = parseInt(lineMatch[4], 10) || undefined
    return {
      filename,
      functionName,
      lineno,
      colno
    }
  }
  // 无 stack 时直接返回
  if (!stack) {
    return []
  }
  const frames = []
  for (const line of stack.split('\n').slice(1)) {
    const frame = parseStackLine(line)
    if (frame) {
      frames.push(frame)
    }
  }
  return frames.slice(0, STACKTRACE_LIMIT)
}

// 获取vue报错组件信息
export const getVueComponentInfo = (vm: any) => {
  const classifyRE = /(?:^|[-_])(\w)/g
  const classify = (str: string) =>
    str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '')
  const ROOT_COMPONENT_NAME = '<Root>'
  const ANONYMOUS_COMPONENT_NAME = '<Anonymous>'
  if (!vm) {
    return {
      componentName: ANONYMOUS_COMPONENT_NAME,
      url: ''
    }
  }
  if (vm.$root === vm) {
    return {
      componentName: ROOT_COMPONENT_NAME,
      url: ''
    }
  }
  const options = vm.$options
  let name = options.name || options._componentTag
  const file = options.__file
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/)
    if (match) {
      name = match[1]
    }
  }
  return {
    componentName: name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME,
    url: file
  }
}
