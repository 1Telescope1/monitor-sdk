import { getBehaviour, getRecordScreenData } from '../behavior'
import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { stutterStype } from '../types'

let lastFrameTime = performance.now()
let lastReportTime = 0
let frameCount = 0
const minFPS = 24
const reportInterval = 3000 // 每隔 3 秒最多上报一次

function trackFPS(timestamp: number) {
  // 如果页面不可见，则重置计数器

  // 计算每一帧的时间间隔
  const delta = timestamp - lastFrameTime

  frameCount++

  // 每过一秒输出 FPS
  if (delta >= 1000) {
    if (
      frameCount <= minFPS &&
      performance.now() - lastReportTime > reportInterval
    ) {
      const behavior = getBehaviour()
      const state = behavior?.breadcrumbs?.state || []
      const eventData = getRecordScreenData()
      const reportData: stutterStype = {
        type: TraceTypeEnum.exception,
        subType: TraceSubTypeEnum.stutter,
        pageUrl: window.location.href,
        timestamp: Date.now(),
        state,
        eventData
      }
      lastReportTime = performance.now()
      lazyReportBatch(reportData)
    }
    frameCount = 0
    lastFrameTime = timestamp
  }

  // 继续请求下一帧
  requestAnimationFrame(trackFPS)
}

export default function stutterLoop() {
  requestAnimationFrame(trackFPS)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      frameCount = 1000
      lastFrameTime = 0
    }
  })
}
