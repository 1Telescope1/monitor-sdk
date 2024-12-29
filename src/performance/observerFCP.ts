import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { PaintType } from '../types'

export default function observerFCP() {
  const entryHandler = (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect()
        const json = entry.toJSON()
        const reportData: PaintType = {
          ...json,
          type: TraceTypeEnum.performance,
          subType: TraceSubTypeEnum.fcp,
          pageUrl: window.location.href,
          timestamp: new Date().getTime()
        }
        // 发送数据 todo;
        lazyReportBatch(reportData)
      }
    }
  }
  // 统计和计算fcp的时间
  const observer = new PerformanceObserver(entryHandler)
  // buffered: true 确保观察到所有paint事件
  observer.observe({ type: 'paint', buffered: true })
}
