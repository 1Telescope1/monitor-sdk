import { report } from '../common/report'

export default function observerPaint() {
  const entryHandler = (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-paint') {
        observer.disconnect()
        const json = entry.toJSON() as PerformanceEntry
        // 定义 reportData 的类型
        const reportData = {
          ...json,
          type: 'performance',
          subType: entry.name,
          pageUrl: window.location.href
        }

        // 发送数据 todo;
        report(reportData)
      }
    }
  }

  // 统计和计算fp的时间
  const observer = new PerformanceObserver(entryHandler)

  // buffered: true 确保观察到所有 paint 事件
  observer.observe({ type: 'paint', buffered: true })
}
