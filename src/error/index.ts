import { report } from '../common/report'

export default function error() {
  // 捕获资源加载失败的错误： js css  img
  // @ts-ignore
  window.addEventListener(
    'error',
    (e: any) => {
      // 通过 e.target 确定错误是发生在哪个资源上
      const target = e.target
      if (target) {
        // 对于图片和脚本，通常有 src 属性；对于样式表是 href 属性
        // @ts-ignore
        const url = target?.src || target?.href

        // 这里只针对资源加载错误（如图片、脚本和样式表）进行处理
        if (url) {
          const reportData = {
            type: 'error',
            subType: 'resource',
            url,
            html: target.outerHTML, // 触发错误的元素的 HTML
            pageUrl: window.location.href
          }

          console.log('Resource Error:', reportData)
        }
      }
    },
    true
  )
  // 捕获js错误
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    const reportData = {
      type: 'error',
      subType: 'js',
      msg,
      url,
      lineNo,
      columnNo,
      stack: error?.stack,
      pageUrl: window.location.href,
      startTime: performance.now()
    }
    // todo 发送错误信息
    report(reportData)
  }
  // 捕获promise错误  asyn await
  window.addEventListener(
    'unhandledrejection',
    (e: PromiseRejectionEvent) => {
      const reportData = {
        type: 'error',
        subType: 'promise',
        reason: e.reason?.stack,
        pageUrl: window.location.href,
        startTime: e.timeStamp
      }
      // todo 发送错误信息
      report(reportData)
    },
    true
  )
}
