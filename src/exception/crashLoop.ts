import { getRecordScreenData, getBehaviour } from '../behavior'
import { getConfig } from '../common/config'

export default function crashLoop() {
  if (window.Worker) {
    // 获取配置信息
    const { userId, url } = getConfig()
    // 将 Web Worker 的代码以字符串形式定义
    const workerCode = `
      let pageTime = performance.now(); // 页面主线程响应的时间
      let checkTime = performance.now(); // 当前 Web Worker 的时间

      let intervalId;
      const setTimeoutTime = 2000;
      let nowUrl = '';
      let crash = false;
      let fetchUrl = ''; // 主线程传递的url
      let userId = ''; // 主线程传递的userId
      let crashEventData = []; // 主线程传递的eventData
      let crashState = []; // 主线程传递的state
      // 监听主线程消息
      onmessage = (event) => {
        let { type, pageTime: receivedPageTime, pageUrl, url, id, eventData, state } = event.data;        
        if (url) {
          fetchUrl = url; // 接收主线程传递的配置
        }
        if (id) {
          userId = id; // 接收主线程传递的配置
        }
        nowUrl = pageUrl;
        crashState = state;
        crashEventData = eventData;
        if (type === 'heartbeat-response') {
          pageTime = receivedPageTime;
        } else if (type === 'page-unload') {
          isCrash();
          const nowTime = performance.now();
          if (nowTime - pageTime >= setTimeoutTime * 2 && !crash) {
            reportError();
          }
          // 停止心跳检测并关闭 Worker
          clearInterval(intervalId);
          close();
        }
      };

      function reportError() {
        const data = {
          type: 'exception',
          subType: 'crash',
          pageUrl: nowUrl,
          timestamp: new Date().getTime(),
          eventData: crashEventData,
          state: crashState
        };
        // 检查配置并发送错误报告
        const reportData = {
          userId: userId || 'unknown',
          data: [data],
        };        
        
        fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        }).catch((error) => console.error('Error sending report:', error));
        
      }

      function isCrash() {
        if (checkTime - pageTime >= setTimeoutTime * 2) {
          if (!crash) {
            reportError();
          }
          console.error('页面可能已经崩溃！');
          crash = true;
          clearInterval(intervalId);
        }
      }

      function sendHeartbeat() {
        checkTime += setTimeoutTime; // 每次发送心跳时增加 2 秒
        postMessage({ type: 'heartbeat' }); // 给主线程发送心跳消息
      }

      // 启动心跳检测，每 2 秒发送一次心跳
      intervalId = setInterval(() => {
        isCrash();
        sendHeartbeat();
      }, setTimeoutTime);
    `

    // 创建一个 Blob 对象，并生成 Worker 的 URL
    const workerBlob = new Blob([workerCode], {
      type: 'application/javascript'
    })
    const workerUrl = URL.createObjectURL(workerBlob)

    // 创建 Worker 实例
    const worker = new Worker(workerUrl)

    // 发送配置到 Worker
    worker.postMessage({ id: userId, url })

    // 监听 Web Worker 的心跳消息
    worker.onmessage = (event: any) => {
      const { type } = event.data
      if (type === 'heartbeat') {
        // 响应心跳消息，发送当前时间戳
        const eventData = getRecordScreenData()
        const behavior = getBehaviour()
        const state = behavior?.breadcrumbs?.state || []
        worker.postMessage({
          type: 'heartbeat-response',
          pageTime: performance.now(),
          pageUrl: window.location.href,
          eventData,
          state
        })
      }
    }

    // 页面卸载时通知 Web Worker
    window.addEventListener('beforeunload', () => {
      worker.postMessage({ type: 'page-unload' })
    })
  } else {
    console.error('当前浏览器不支持 Web Worker')
  }
}
