import { getBehaviour } from '../behavior'
import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import {
  getErrorUid,
  getVueComponentInfo,
  parseStackFrames
} from '../common/utils'
import { VueErrorType } from '../types'

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
    const { componentName, url: src } = getVueComponentInfo(vm)
    const type = TraceTypeEnum.error
    const subType = TraceSubTypeEnum.vue
    const message = err.message
    const stack = parseStackFrames(err)
    const pageUrl = window.location.href
    const behavior = getBehaviour()
    const state = behavior?.breadcrumbs?.state || []
    const reportData: VueErrorType = {
      type,
      subType,
      message,
      stack,
      pageUrl,
      info,
      componentName,
      src,
      errId: getErrorUid(`${subType}-${message}-${src}`),
      state,
      timestamp: new Date().getTime()
    }
    lazyReportBatch(reportData)
  }
}

export default initVueError
