import { getConfig } from '../common/config'
import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { PerformanceResourceType, resourceType } from '../types'

export default function observerEntries() {
  if (document.readyState === 'complete') {
    observerEvent()
  } else {
    const onLoad = () => {
      observerEvent()
      window.removeEventListener('load', onLoad, true)
    }
    window.addEventListener('load', onLoad, true)
  }
}
export function observerEvent() {
  const config = getConfig()
  const url = config.url
  const parsedUrl = new URL(url)
  const host = parsedUrl.host
  const entryHandler = (list: PerformanceObserverEntryList) => {
    const dataList: PerformanceResourceType[] = []
    const entries = list.getEntries()
    for (let i = 0; i < entries.length; i++) {
      const resourceEntry = entries[i] as PerformanceResourceTiming

      // 避免sdk自己发的请求又被上报无限循环
      if (resourceEntry.name.includes(host)) {
        continue
      }
      const data: PerformanceResourceType = {
        type: TraceTypeEnum.performance,
        subType: resourceEntry.entryType, // 类型
        name: resourceEntry.name, // 资源的名字
        sourceType: resourceEntry.initiatorType, // 资源类型
        duration: resourceEntry.duration, // 加载时间
        dns: resourceEntry.domainLookupEnd - resourceEntry.domainLookupStart, // dns解析时间
        tcp: resourceEntry.connectEnd - resourceEntry.connectStart, // tcp连接时间
        redirect: resourceEntry.redirectEnd - resourceEntry.redirectStart, // 重定向时间
        ttfb: resourceEntry.responseStart, // 首字节时间
        protocol: resourceEntry.nextHopProtocol, // 请求协议
        responseBodySize: resourceEntry.encodedBodySize, // 响应内容大小
        responseHeaderSize:
          resourceEntry.transferSize - resourceEntry.encodedBodySize, // 响应头部大小
        transferSize: resourceEntry.transferSize, // 请求内容大小
        resourceSize: resourceEntry.decodedBodySize, // 资源解压后的大小
        startTime: resourceEntry.startTime, // 资源开始加载的时间
        pageUrl: window.location.href, // 页面地址
        timestamp: new Date().getTime()
      }
      dataList.push(data)
      if (i === entries.length - 1) {
        const reportData: resourceType = {
          type: TraceTypeEnum.performance, // 类型
          subType: TraceSubTypeEnum.resource, // 类型
          resourceList: dataList,
          timestamp: new Date().getTime()
        }
        lazyReportBatch(reportData)
      }
    }
  }

  const observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: 'resource', buffered: true })
}
