import { ConfigType } from '../types'

const config: ConfigType = {
  url: 'http://127.0.0.1:3000/api/data',
  projectName: 'monitor',
  appId: '123456',
  userId: '123456',
  isAjax: false,
  batchSize: 5,
  containerElements: ['html', 'body', '#app', '#root'],
  skeletonElements: []
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
