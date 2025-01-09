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
    // sendBeacon 最大支持64kb数据
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
  const jsonData = JSON.stringify(reportData)
  const response = JSON.parse(jsonData)
  config.reportBefore && config.reportBefore(response.data)
  sendTraceServer(jsonData)
    .then(() => {
      config.reportSuccess && config.reportSuccess(response.data)
    })
    .catch(() => {
      config.reportFail && config.reportFail(response.data)
    })
    .finally(() => {
      console.log('埋点上报----', response.data)
      config.reportAfter && config.reportAfter(response.data)
    })
}

// 批量上报数据
export function lazyReportBatch(data: any) {
  addCache(data)
  const dataCache = getCache()

  const reportData = async () => {
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
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = `${config.url}?data=${encodeURIComponent(data)}`
  })
}

// 普通ajax发送请求数据
function xhrRequest(data: any) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    originalOpen.call(xhr, 'POST', config.url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject(new Error('XHR request failed'))
      }
    }

    xhr.onerror = () => reject(new Error('XHR request failed'))

    const sendData = () => originalSend.call(xhr, data)
    sendData()
  })
}

// sendBeacon发送数据
function beaconRequest(data: any) {
  return new Promise((resolve, reject) => {
    const result = window.navigator.sendBeacon(config.url, data)
    if (result) {
      resolve('Beacon request succeeded')
    } else {
      reject(new Error('Beacon request failed'))
    }
  })
}
