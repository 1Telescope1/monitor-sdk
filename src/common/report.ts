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
    data: {
      ...data
    }
  })
  sendServe(reportData)
}

// 批量上报数据
export function lazyReportBatch(data: any) {
  addCache(data)
  const dataCache = getCache()

  if (
    (data.type === 'error' && data.subType !== 'resource') ||
    data.type === 'exception'
  ) {
    const state = window.$SDK?.Behaviour?.breadcrumbs?.state || []
    const errData = {
      state,
      type: 'behavior',
      subType: 'behavior-store'
    }
    addCache(errData)
  }

  const reportData = () => {
    if (!dataCache.length) {
      return
    }
    report(dataCache)
    clearCache()
  }
  if (dataCache.length && dataCache.length > config.batchSize) {
    reportData()
  } else {
    setTimeout(reportData, 0)
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(reportData, { timeout: 800 })
    } else {
      setTimeout(reportData, 800)
    }
  }
}

// 图片发送数据
function imgRequest(data: any) {
  const img = new Image()
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`
}

// 普通ajax发送请求数据
function xhrRequest(data: any) {
  const xhr = new XMLHttpRequest()
  originalOpen.call(xhr, 'post', config.url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')

  const sendData = () => originalSend.call(xhr, data)

  if (window.requestIdleCallback) {
    window.requestIdleCallback(sendData, { timeout: 1000 })
  } else {
    setTimeout(sendData, 0)
  }
}

function beaconRequest(data: any) {
  const sendData = () => window.navigator.sendBeacon(config.url, data)
  sendData()
}
