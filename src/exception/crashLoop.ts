// @ts-ignore
import Worker from '../common/webWorker.ts?worker'

export default function crashLoop() {
  if (window.Worker) {
    const worker = new Worker()
    // 监听 Web Worker 的心跳消息
    worker.onmessage = (event: any) => {
      const { type } = event.data
      if (type === 'heartbeat') {
        // 响应心跳消息，发送当前时间戳
        worker.postMessage({
          type: 'heartbeat-response',
          pageTime: performance.now(),
          pageUrl: window.location.href
        })
      }
    }

    // 页面卸载通知 Web Worker
    window.addEventListener('beforeunload', () => {
      worker.postMessage({ type: 'page-unload' })
    })
  } else {
    console.error('不支持webWorker')
  }
}
