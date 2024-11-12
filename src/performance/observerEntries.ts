import { report } from '../common/report'

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
  const entryHandler = (list: PerformanceObserverEntryList) => {
    const entries = list.getEntries()
    for (const entry of entries) {
      const resourceEntry = entry as PerformanceResourceTiming
      const reportData = {
        name: resourceEntry.name, // 资源的名字
        type: 'performance', // 类型
        subType: resourceEntry.entryType, // 类型
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
        startTime: resourceEntry.startTime // 资源开始加载的时间
      }
      // 这里可以将 reportData 发送到服务器或者做其他处理
      report(reportData)
      // console.log(reportData);
    }
  }

  const observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: 'resource', buffered: true })
}
