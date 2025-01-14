<h1 align="center" style="font-size: 2.5em; color: #333;">monitor-sdk</h1>
<hr style="border: 1px solid #ccc;"/>

<p align=left><strong>monitor-sdk</strong>
<span style="color: #007BFF;">是一款基于js跨平台的前端监控插件，它具备性能指标采集能力，包括页面、资源加载时间和网络请求耗时等关键数据。同时能够捕获并上报页面错误，如 Js错误、资源加载错误以及 Promise 异常还提供白屏检测、页面卡顿和页面崩溃监控，收集用户行为栈、录制用户操作实现错误节点回溯。</span>
</p>

### 一、核心功能 📖
![image](https://github.com/user-attachments/assets/06bdc0a4-a2cd-46f5-bbe5-e78edb1a148c)


### 二、快速开始 🚩
#### react项目中使用
命令行安装依赖
```shell
npm install @web-tracke/monitor
```

```js
// main.tsx
import monitorSDK from '@web-tracke/monitor'

const options = {
  url: 'http://127.0.0.1:3000/api/data', // 上报地址
  projectName: 'monitor', // 项目名称
  appId: '123456', // 项目id
  userId: '123456', // 用户id
  isAjax: false, // 是否开启ajax上报
  batchSize: 5, // 批量上报大小
  containerElements: ['html', 'body', '#app', '#root'], // 容器元素
  skeletonElements: [], // 骨架屏元素
  reportBefore: () => {}, // 上报前回调
  reportAfter: () => {}, // 上报后回调
  reportSuccess: () => {}, // 上报成功回调
  reportFail: () => {}, // 上报失败回调
}

monitorSDK.init(options)
monitorSDK.Performance()
monitorSDK.Error.initErrorEventListener()
monitorSDK.Behavior()
monitorSDK.Exception()

.......

const ErrorBoundary = monitorSDK.Error.ErrorBoundary
function ErrorFallback({ error }: { error: any }) {
  console.log(error);
  return <div>发生错误: {error.message},请稍后重试。</div>;
}
<ErrorBoundary Fallback={ErrorFallback}>
  <App />
</ErrorBoundary>
```
详细实例可自行拉取 https://github.com/1Telescope1/monitor-sdk-test

#### vue项目中使用
命令行安装依赖
```shell
npm install @web-tracke/monitor
```
在vue3中
```js
// main.ts
import { createApp } from 'vue'
import monitorSDK from '@web-tracke/monitor'

const app = createApp(App)

const options = {}
monitorSDK.init(options)
monitorSDK.Error.initVueError(app) // vue专门的errorHandle
monitorSDK.Performance()
monitorSDK.Error.initErrorEventListener()
monitorSDK.Behavior()
monitorSDK.Exception()
```
在vue2中
```js
// main.ts
import Vue from 'vue'
import monitorSDK from '@web-tracke/monitor'

const options = {}
monitorSDK.init(options)

monitorSDK.Error.initVueError(Vue) // vue专门的errorHandle
monitorSDK.Performance()
monitorSDK.Error.initErrorEventListener()
monitorSDK.Behavior()
monitorSDK.Exception()
```

### 三、演示示例 👌
拉取示例代码仓库 https://github.com/1Telescope1/monitor-sdk-test
1. 性能监控
![image](https://github.com/user-attachments/assets/4375b9cc-8ae7-4b57-9120-6912b0497b01)

2. 错误监控
![image](https://github.com/user-attachments/assets/818cebbc-e3c8-4d32-87e8-703888fb404a)
https://github.com/user-attachments/assets/ad241de5-6f40-4260-a542-2f8c49061492

3. 异常监控
![image](https://github.com/user-attachments/assets/54db7727-9ec6-42a2-a9ac-fb375900b924)

4. 行为监控
![image](https://github.com/user-attachments/assets/08977945-3e25-4e91-9643-146319ec47cc)

### 四、未来方向 👊
1. 提供示例vue的仓库
2. 优化逻辑以及增添更多新功能（过滤请求等）
3. sdk的轻量化
