import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { urlToJson } from '../common/utils'
import { AjaxType } from '../types'

export const originalProto = XMLHttpRequest.prototype
export const originalSend = originalProto.send
export const originalOpen = originalProto.open

// 扩展 XMLHttpRequest 类型，允许自定义属性
declare global {
  interface XMLHttpRequest {
    startTime?: number
    endTime?: number
    duration?: number
    method?: string
    url?: string
  }
}

function overwriteOpenAndSend() {
  originalProto.open = function newOpen(
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string,
    password?: string
  ) {
    // 这将保留原始的 open 方法签名，并确保 async、username 和 password 可选
    this.url = url.toString() // 可能需要转为 string 类型
    this.method = method
    originalOpen.apply(this, [method, url, async, username, password])
  }

  originalProto.send = function newSend(
    ...args: [Document | XMLHttpRequestBodyInit | null | undefined]
  ) {
    this.addEventListener('loadstart', () => {
      this.startTime = Date.now()
    })

    const onLoaded = () => {
      this.endTime = Date.now()
      this.duration = (this.endTime ?? 0) - (this.startTime ?? 0)
      const { url, method, startTime, endTime, duration, status } = this
      const params = (args[0] ? args[0] : urlToJson(url as string)) as string

      const reportData: AjaxType = {
        status,
        duration,
        startTime,
        endTime,
        url,
        method: method?.toUpperCase(),
        type: TraceTypeEnum.performance,
        success: status >= 200 && status < 300,
        subType: TraceSubTypeEnum.xhr,
        pageUrl: window.location.href,
        params,
        timestamp: new Date().getTime()
      }
      // todo: 发送数据
      lazyReportBatch(reportData)
      this.removeEventListener('loadend', onLoaded, true)
    }

    this.addEventListener('loadend', onLoaded, true)
    originalSend.apply(this, args)
  }
}

export default function xhr() {
  overwriteOpenAndSend()
}
