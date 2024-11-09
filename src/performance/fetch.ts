const originalFetch: typeof window.fetch = window.fetch

function overwriteFetch(): void {
  window.fetch = function newFetch(
    url: string | URL | Request,
    config?: RequestInit
  ): Promise<Response> {
    const startTime = Date.now()
    const urlString =
      typeof url === 'string' ? url : url instanceof URL ? url.href : url.url
    const reportData = {
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
        const endTime = Date.now()
        reportData.endTime = endTime
        reportData.duration = endTime - startTime
        reportData.status = res.status
        reportData.success = res.ok
        // todo 上报数据
        return res
      })
      .catch(err => {
        const endTime = Date.now()
        reportData.endTime = endTime
        reportData.duration = endTime - startTime
        reportData.status = 0
        reportData.success = false
        // todo 上报数据

        // Rethrow the error
        throw err
      })
  }
}

export default function fetch(): void {
  overwriteFetch()
}
