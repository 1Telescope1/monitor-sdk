/* eslint-disable no-unused-vars */
export enum TraceTypeEnum {
  performance = 'performance',
  exception = 'exception',
  error = 'error',
  behavior = 'behavior'
}

/* eslint-disable no-unused-vars */
export enum TraceSubTypeEnum {
  fetch = 'fetch',
  load = 'load',
  xhr = 'xhr',
  stutter = 'stutter',
  whiteScreen = 'whiteScreen',
  js = 'js',
  cors = 'cors',
  resource = 'resource',
  promise = 'promise',
  react = 'react',
  vue = 'vue',
  routerChange = 'routerChange',
  pv = 'pv',
  fcp = 'fcp',
  fp = 'fp',
  lcp = 'lcp',
  fmp = 'fmp',
  tracker = 'tracker'
}

/**
 * 网页的几种加载方式
 */
export const WebPageLoad: Record<number, string> = {
  0: 'navigate', // 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
  1: 'reload', // 网页通过“重新加载”按钮或者location.reload()方法加载
  2: 'back_forward', // 网页通过“前进”或“后退”按钮加载
  255: 'reserved' // 任何其他来源的加载
}
