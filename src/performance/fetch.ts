import { report } from '../common/report'
import { AjaxType } from '../types'

const originalFetch: typeof window.fetch = window.fetch

function overwriteFetch(): void {
  window.fetch = function newFetch(
    url: string | URL | Request,
    config?: RequestInit
  ): Promise<Response> {
    const startTime = Date.now()
    const urlString =
      typeof url === 'string' ? url : url instanceof URL ? url.href : url.url
    const reportData: AjaxType = {
      type: 'performance',
      subType: 'fetch',
      url: urlString,
      startTime,
      endTime: 0,
      duration: 0,
      status: 0,
      success: false,
      method: config?.method || 'GET'
    }
    return originalFetch(url, config)
      .then(res => {
        return res
      })
      .catch(err => {
        throw err
      })
      .finally(() => {
        const endTime = Date.now()
        reportData.endTime = endTime
        reportData.duration = endTime - startTime
        reportData.status = 0
        reportData.success = false
        // todo 上报数据
        report(reportData)
      })
  }
}

export default function fetch(): void {
  overwriteFetch()
}
