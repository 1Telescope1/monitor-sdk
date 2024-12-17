// 派发出新的 Event
const wr = (type: keyof History) => {
  const orig = history[type]

  /* eslint-disable no-unused-vars */
  return function (this: unknown) {
    const rv = orig.apply(this, arguments)
    const e = new Event(type)
    window.dispatchEvent(e)
    return rv
  }
}

// 添加 pushState replaceState 事件
export const wrHistory = (): void => {
  history.pushState = wr('pushState')
  history.replaceState = wr('replaceState')
}

// 为 pushState 以及 replaceState 方法添加 Event 事件
export const proxyHistory = (handler: Function): void => {
  // 添加对 replaceState 的监听
  window.addEventListener('replaceState', e => handler(e), true)
  // 添加对 pushState 的监听
  window.addEventListener('pushState', e => handler(e), true)
}

export const proxyHash = (handler: Function): void => {
  // 添加对 hashchange 的监听
  // hash 变化除了触发 hashchange ,也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
  // 这里可以考虑是否需要监听 hashchange,或者只监听 hashchange
  // window.addEventListener('hashchange', (e) => handler(e), true);
  // 添加对 popstate 的监听
  // 浏览器回退、前进行为触发的 可以自己判断是否要添加监听
  window.addEventListener('popstate', e => handler(e), true)
}
