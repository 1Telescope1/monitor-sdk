import { getConfig } from './config'
import { addCache, getCache, clearCache } from './cache'
import { isObjectSize } from './utils'

const originalOpen = XMLHttpRequest.prototype.open
const originalSend = XMLHttpRequest.prototype.send

function isSupportSendBeacon() {
  return 'sendBeacon' in window.navigator
}

const config = getConfig()
const sendServe = (reportData: any) => {
  let sendType = 'xhr'
  let sendTraceServer = xhrRequest
  const ObjectSize = isObjectSize(reportData)

  if (config.isAjax) {
    sendTraceServer = xhrRequest
    sendType = 'xhr'
  } else if (isSupportSendBeacon() && ObjectSize < 60) {
    // searchBeacon 最大支持64kb数据
    sendTraceServer = beaconRequest
    sendType = 'beacon'
  } else if (ObjectSize < 2) {
    // 图片最大支持2kb数据
    sendTraceServer = imgRequest
    sendType = 'img'
  }
  reportData = {
    data: reportData,
    userId: config.userId,
    sendType
  }
  sendTraceServer(JSON.stringify(reportData))
}

// 批量上报数据
export function lazyReportBatch(data: any) {
  addCache(data)
  const dataCache = getCache()
  const reportData = () => {
    if (!dataCache.length) {
      return
    }
    sendServe(dataCache)
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
