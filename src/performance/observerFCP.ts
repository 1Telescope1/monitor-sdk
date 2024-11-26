import { report } from '../common/report'
import { PaintType } from '../types'

export default function observerFCP() {
  const entryHandler = (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect()
        const json = entry.toJSON()
        const reportData: PaintType = {
          ...json,
          type: 'performance',
          subType: entry.entryType,
          pageUrl: window.location.href
        }
        // 发送数据 todo;
        report(reportData)
      }
    }
  }
  // 统计和计算fcp的时间
  const observer = new PerformanceObserver(entryHandler)
  // buffered: true 确保观察到所有paint事件
  observer.observe({ type: 'paint', buffered: true })
}
