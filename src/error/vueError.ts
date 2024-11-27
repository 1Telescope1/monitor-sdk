import { ErrorEnum } from '../common/enum'
import { report } from '../common/report'
import { getVueComponentInfo, parseStackFrames } from '../common/utils'

// 初始化 Vue异常 的数据获取和上报
export interface Vue {
  config: {
    errorHandler?: any
    warnHandler?: any
  }
}

const initVueError = (app: Vue) => {
  app.config.errorHandler = (err: Error, vm: any, info: string) => {
    console.error(err)
    const { componentName, url } = getVueComponentInfo(vm)
    const type = 'error'
    const subType = ErrorEnum.VUE
    const message = err.message
    const stack = parseStackFrames(err)
    const pageUrl = window.location.href
    const reportData = {
      type,
      subType,
      message,
      stack,
      pageUrl,
      info,
      componentName,
      url
    }
    report(reportData)
  }
}

export default initVueError
