export default function crashLoop() {
  // 判断当前环境是否为开发环境
  // @ts-ignore
  const workerPath =
    import.meta.env.MODE === 'development'
      ? '../common/webWorker.ts?worker' // 开发环境使用 ?worker 后缀
      : 'web-worker:../common/webWorker.ts' // 生产环境使用 web-worker: 前缀

  // 动态导入 Web Worker
  import(workerPath)
    .then(WorkerModule => {
      if (window.Worker) {
        const worker = new WorkerModule.default()

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
    })
    .catch(error => {
      console.error('Web Worker 加载失败:', error)
    })
}
