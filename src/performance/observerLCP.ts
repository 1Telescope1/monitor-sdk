import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { PaintType } from '../types'

export default function observerLCP() {
  const entryHandler = (list: PerformanceObserverEntryList) => {
    if (observer) {
      observer.disconnect()
    }
    for (const entry of list.getEntries()) {
      const json = entry.toJSON()
      const reportData: PaintType = {
        ...json,
        type: TraceTypeEnum.performance,
        subType: TraceSubTypeEnum.lcp,
        pageUrl: window.location.href,
        timestamp: new Date().getTime()
      }
      // 发送数据 todo;
      lazyReportBatch(reportData)
    }
  }
  // 统计和计算lcp的时间
  const observer = new PerformanceObserver(entryHandler)
  // buffered: true 确保观察到所有paint事件
  observer.observe({ type: 'largest-contentful-paint', buffered: true })
}
