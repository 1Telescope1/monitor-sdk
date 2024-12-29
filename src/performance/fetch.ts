import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { urlToJson } from '../common/utils'
import { AjaxType } from '../types'

const originalFetch: typeof window.fetch = window.fetch

function overwriteFetch(): void {
  window.fetch = function newFetch(
    url: any,
    config?: RequestInit
  ): Promise<Response> {
    const params = (
      config?.body ? config.body : urlToJson(url as string)
    ) as string
    const startTime = Date.now()
    const urlString =
      typeof url === 'string' ? url : url instanceof URL ? url.href : url.url
    const reportData: AjaxType = {
      type: TraceTypeEnum.performance,
      subType: TraceSubTypeEnum.fetch,
      url: urlString,
      startTime,
      endTime: 0,
      duration: 0,
      status: 0,
      success: false,
      method: config?.method || 'GET',
      pageUrl: window.location.href,
      params,
      timestamp: new Date().getTime()
    }
    return originalFetch(url, config)
      .then(res => {
        reportData.status = res.status
        return res
      })
      .catch(err => {
        reportData.status = err.status
        throw err
      })
      .finally(() => {
        const endTime = Date.now()
        reportData.endTime = endTime
        reportData.duration = endTime - startTime
        reportData.success = false
        // todo 上报数据
        lazyReportBatch(reportData)
      })
  }
}

export default function fetch(): void {
  overwriteFetch()
}
