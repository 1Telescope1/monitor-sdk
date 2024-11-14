export type ConfigType = {
  url: string
  projectName: string
  appId: string
  userId: string
  isImageUpload: boolean
  batchSize: number
  [key: string]: string | boolean | number // 添加索引签名
}
