import { getBehaviour } from '../behavior'
import { CrashType } from '../types'
import { getConfig } from './config'

// 初始化时间记录
let pageTime = performance.now() // 页面主线程响应的时间
let checkTime = performance.now() // 当前 Web Worker 的时间

let intervalId: any
const setTimeoutTime = 2000
let nowUrl = ''
const config = getConfig()
let crash = false

// 心跳检测函数
function sendHeartbeat() {
  checkTime += setTimeoutTime // 每次发送心跳时增加 2 秒
  postMessage({ type: 'heartbeat' }) // 给主线程发送心跳消息
}

// 监听主线程消息
onmessage = event => {
  const { type, pageTime: receivedPageTime, pageUrl } = event.data
  nowUrl = pageUrl
  if (type === 'heartbeat-response') {
    // 主线程返回心跳响应时，更新 pageTime
    pageTime = receivedPageTime
  } else if (type === 'page-unload') {
    isCrash()
    const nowTime = performance.now()
    if (nowTime - pageTime >= setTimeoutTime * 2 && !crash) {
      reportError()
    }
    // 主线程通知页面卸载时，停止心跳检测
    clearInterval(intervalId)
    close()
  }
}

const reportError = () => {
  const behavior = getBehaviour()
  const state = behavior?.breadcrumbs?.state || []
  const data: CrashType = {
    type: 'exception',
    subType: 'crash',
    pageUrl: nowUrl,
    timestamp: new Date().getTime(),
    state
  }
  const reportData = {
    userId: config.userId,
    data: { ...data }
  }
  fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportData)
  })
}

const isCrash = () => {
  if (checkTime - pageTime >= setTimeoutTime * 2) {
    if (!crash) {
      reportError()
    }
    console.error('页面可能已经崩溃！')
    crash = true
    clearInterval(intervalId)
  }
}

// 启动心跳检测，每 3 秒发送一次心跳
intervalId = setInterval(() => {
  // 判断是否崩溃
  isCrash()
  sendHeartbeat()
}, setTimeoutTime)
