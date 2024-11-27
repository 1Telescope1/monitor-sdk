import { report } from '../common/report'
import { getPathToElement, parseStackFrames } from '../common/utils'
import { JsErrorType, PromiseErrorType, ResourceErrorType } from '../types'

export default function error() {
  // 捕获资源加载失败的错误： js css  img
  window.addEventListener(
    'error',
    (e: any) => {
      // 通过 e.target 确定错误是发生在哪个资源上
      const target = e.target
      if (target instanceof Window) {
        return
      }
      if (target) {
        // 对于图片和脚本，通常有 src 属性；对于样式表是 href 属性
        const src = target?.src || target?.href
        const path = getPathToElement(target)
        const reportData: ResourceErrorType = {
          type: 'error',
          subType: 'resource',
          src,
          pageUrl: window.location.href,
          tagName: target.tagName,
          path
        }
        report(reportData)
        console.error('Resource Error:', reportData)
      }
    },
    true
  )
  // 捕获js错误
  window.onerror = async (msg, src, lineNo, columnNo, error) => {
    const stack = parseStackFrames(error as Error)
    const reportData: JsErrorType = {
      type: 'error',
      subType: 'js',
      msg,
      src,
      lineNo,
      columnNo,
      stack,
      pageUrl: window.location.href
    }
    // todo 发送错误信息
    report(reportData)
  }
  // 捕获promise错误  asyn await
  window.addEventListener(
    'unhandledrejection',
    (e: PromiseRejectionEvent) => {
      const stack = parseStackFrames(e.reason)
      const reportData: PromiseErrorType = {
        type: 'error',
        subType: 'promise',
        msg: e.reason.message,
        stack,
        pageUrl: window.location.href
      }
      // todo 发送错误信息
      report(reportData)
    },
    true
  )
}
