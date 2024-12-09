import { getConfig } from './config'
import { addCache, getCache, clearCache } from './cache'
const originalOpen = XMLHttpRequest.prototype.open
const originalSend = XMLHttpRequest.prototype.send
function isSupportSendBeacon() {
  return 'sendBeacon' in window.navigator
}

const config = getConfig()

let sendServe: any
if (config.isImageUpload) {
  sendServe = imgRequest
} else {
  if (isSupportSendBeacon() && config.isBeaconUpload) {
    sendServe = beaconRequest
  } else {
    sendServe = xhrRequest
  }
}

export function report(data: any) {
  const reportData = JSON.stringify({
    userId: config.userId,
    ...data
  })
  sendServe(reportData)
  if (
    (data.type == 'error' && data.subType !== 'resource') ||
    data.type === 'exception'
  ) {
    const state = window.behavior.breadcrumbs.state
    const reportData = {
      userId: config.userId,
      state,
      type: 'behavior',
      subType: 'behavior-store'
    }
    sendServe(reportData)
  }
}

// 批量上报数据
export function lazyReportBatch(data: any) {
  addCache(data)
  const dataCache = getCache()
  console.error('dataCache', dataCache)
  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache)
    clearCache()
  }
  //
}
// 图片发送数据
function imgRequest(data: any) {
  const img = new Image()
  // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`
}
// 普通ajax发送请求数据
function xhrRequest(data: any) {
  const xhr = new XMLHttpRequest()
  originalOpen.call(xhr, 'post', config.url, true)
  // 设置请求头
  xhr.setRequestHeader('Content-Type', 'application/json')

  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        originalSend.call(xhr, data)
      },
      { timeout: 3000 }
    )
  } else {
    setTimeout(() => {
      originalSend.call(xhr, data)
    })
  }
}

function beaconRequest(data: any) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        window.navigator.sendBeacon(config.url, data)
      },
      { timeout: 3000 }
    )
  } else {
    setTimeout(() => {
      window.navigator.sendBeacon(config.url, data)
    })
  }
}
