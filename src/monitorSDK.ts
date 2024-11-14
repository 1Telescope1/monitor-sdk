import { report } from './common/report'
import behavior from './behavior'
import performance from './performance'
import { setConfig } from './common/config'
import { ConfigType } from './types'

const monitorSDK = {
  vue: false,
  react: false
}

// 针对Vue项目的错误捕获
export function install(Vue, options) {
  if (monitorSDK.vue) {
    return
  }
  monitorSDK.vue = true
  const handler = Vue.config.errorHandler
  // vue项目中 通过 Vue.config.errorHandler 捕获错误
  Vue.config.errorHandler = function (err, vm, info) {
    // todo: 上报具体的错误信息
    const reportData = {
      info,
      error: err.stack,
      subType: 'vue',
      type: 'error',
      startTime: window.performance.now(),
      pageURL: window.location.href
    }
    report(reportData)
    if (handler) {
      handler.call(this, err, vm, info)
    }
  }
}
// 针对React项目的错误捕获
export function errorBoundary(err, info) {
  if (monitorSDK.react) {
    return
  }
  monitorSDK.react = true
  // todo: 上报具体的错误信息
  const reportData = {
    error: err?.stack,
    info,
    subType: 'react',
    type: 'error',
    startTime: window.performance.now(),
    pageURL: window.location.href
  }
  report(reportData)
}

export function init(options: ConfigType) {
  setConfig(options);
  // performance();
  // error();
  // behavior();
}

export default {
  install,
  errorBoundary,
  behavior,
  performance
}
