import { ConfigType } from '../types'

const config: ConfigType = {
  url: 'http://127.0.0.1:8080/api',
  projectName: 'monitor',
  appId: '123456',
  userId: '123456',
  isImageUpload: false,
  batchSize: 5
}

export function setConfig(options: ConfigType) {
  for (const key in config) {
    if (options[key]) {
      config[key] = options[key]
    }
  }
}
export default config
