import { getConfig } from './config'
import { addCache, getCache, clearCache } from './cache'

const originalOpen = XMLHttpRequest.prototype.open
const originalSend = XMLHttpRequest.prototype.send

function isSupportSendBeacon() {
  return 'sendBeacon' in window.navigator
}

const config = getConfig()

const sendServe = (reportData: any) => {
  let sendTraceServer: any

  if (config.isImageUpload) {
    sendTraceServer = imgRequest
  } else {
    if (isSupportSendBeacon() && config.isBeaconUpload) {
      sendTraceServer = beaconRequest
    } else {
      sendTraceServer = xhrRequest
    }
  }
  sendTraceServer(reportData)
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
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(reportData, { timeout: 1000 })
    } else {
      setTimeout(reportData, 1000)
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
  sendData()
}

function beaconRequest(data: any) {
  const sendData = () => window.navigator.sendBeacon(config.url, data)
  sendData()
}
