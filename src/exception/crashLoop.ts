import workerModule from '../common/webWorker.ts?worker'

export default function crashLoop() {
  if (window.Worker) {
    const worker = new workerModule()
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

      // 页面卸载通知 Web Worker
      window.addEventListener('beforeunload', () => {
        worker.postMessage({ type: 'page-unload' })
      })
    }
  } else {
    console.error('不支持webWorker')
  }
}

// export default function crashLoop() {
//   if (window.Worker) {
//     // 判断当前环境是否为开发环境
//     // @ts-ignore
//     // const workerPath =
//     //   import.meta.env.MODE === 'development'
//     //     ? '../common/webWorker.ts?worker' // 开发环境使用 ?worker 后缀
//     //     : 'web-worker:../common/webWorker.ts' // 生产环境使用 web-worker: 前缀
//     // console.log(workerPath);
//     const workerPath = '../common/webWorker.ts?worker'
//     console.log(456);

//     import(workerPath).then(workerModule => {
//       const worker = new workerModule.default()
//       // 监听 Web Worker 的心跳消息
//       worker.onmessage = (event: any) => {
//         const { type } = event.data
//         if (type === 'heartbeat') {
//           // 响应心跳消息，发送当前时间戳
//           worker.postMessage({
//             type: 'heartbeat-response',
//             pageTime: performance.now(),
//             pageUrl: window.location.href
//           })
//         }

//         // 页面卸载通知 Web Worker
//         window.addEventListener('beforeunload', () => {
//           worker.postMessage({ type: 'page-unload' })
//         })
//       }
//     })
//   } else {
//     console.error('不支持webWorker')
//   }
// }

// export default function crashLoop() {
//   if (window.Worker) {
//     // @ts-ignore
//     const workerUrl = new URL('../common/webWorker.ts', import.meta.url).href

//     const worker = new Worker(workerUrl, {
//       type: 'module' // 使用 ES 模块
//     })
//     // const worker = new webWorker()
//     // 监听 Web Worker 的心跳消息
//     worker.onmessage = (event: any) => {
//       const { type } = event.data
//       if (type === 'heartbeat') {
//         // 响应心跳消息，发送当前时间戳
//         worker.postMessage({
//           type: 'heartbeat-response',
//           pageTime: performance.now(),
//           pageUrl: window.location.href
//         })
//       }
//     }
//     // 页面卸载通知 Web Worker
//     window.addEventListener('beforeunload', () => {
//       worker.postMessage({ type: 'page-unload' })
//     })
//   } else {
//     console.error('不支持webWorker')
//   }
// }
