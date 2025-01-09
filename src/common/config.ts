import { ConfigType } from '../types'

const config: ConfigType = {
  url: 'http://127.0.0.1:3000/api/data', // 上报地址
  projectName: 'monitor', // 项目名称
  appId: '123456', // 项目id
  userId: '123456', // 用户id
  isAjax: false, // 是否开启ajax上报
  batchSize: 5, // 批量上报大小
  containerElements: ['html', 'body', '#app', '#root'], // 容器元素
  skeletonElements: [] // 骨架屏元素
}

export function setConfig(options: ConfigType = config) {
  for (const key in options) {
    if (options[key]) {
      config[key] = options[key]
    }
  }
}

export function getConfig() {
  return config
}
