import { getBehaviour, getRecordScreenData } from '../behavior'
import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { lazyReportBatch } from '../common/report'
import { stutterStype } from '../types'

let lastFrameTime = performance.now()
let frameCount = 0
const minFPS = 24

function trackFPS(timestamp: number) {
  // 计算每一帧的时间间隔
  const delta = timestamp - lastFrameTime

  frameCount++

  // 每过一秒输出 FPS
  if (delta >= 1000) {
    if (frameCount <= minFPS) {
      const behavior = getBehaviour()
      const state = behavior?.breadcrumbs?.state || []
      const eventData = getRecordScreenData()
      const reportData: stutterStype = {
        type: TraceTypeEnum.exception,
        subType: TraceSubTypeEnum.stutter,
        pageUrl: window.location.href,
        timestamp: new Date().getTime(),
        state,
        eventData
      }
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
}
