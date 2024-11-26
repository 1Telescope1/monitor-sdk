import config from './config'
import { generateUniqueId } from './utils'
import { addCache, getCache, clearCache } from './cache'
export const originalProto = XMLHttpRequest.prototype
export const originalOpen = XMLHttpRequest.prototype.open
export const originalSend = XMLHttpRequest.prototype.send
export function isSupportSendBeacon() {
  return 'sendBeacon' in window.navigator
}

export function report(data: any) {  
  if (!config.url) {
    console.error('请设置上传 url 地址')
  }
  const reportData = JSON.stringify({
    id: generateUniqueId(),
    data
  })
  // 上报数据，使用图片的方式
  if (config.isImageUpload) {
    imgRequest(reportData)
  } else {
    // 优先使用 sendBeacon
    // @ts-ignore
    if (isSupportSendBeacon() && config.isBeaconUpload) {
      beaconRequest(reportData)
    } else {
      xhrRequest(reportData)
    }
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
export function imgRequest(data: any) {
  const img = new Image()
  // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`
}
// 普通ajax发送请求数据
export function xhrRequest(data: any) {
  const xhr = new XMLHttpRequest()
  originalOpen.call(xhr, 'post', config.url, true)
  // 设置请求头
  xhr.setRequestHeader('Content-Type', 'application/json');
  
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

export function beaconRequest(data: any) {
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
