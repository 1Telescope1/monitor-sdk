export type ConfigType = {
  url: string
  projectName: string
  appId: string
  userId: string
  isImageUpload: boolean
  batchSize: number
  isBeaconUpload: boolean
  [key: string]: string | boolean | number // 添加索引签名
}

export type reportDataType = {
  info?: any
  startTime?: number // 发生时间
  pageURL?: string // 页面路径
  targetName?: string // 触发元素
  innerHtml?: any
  outerHtml?: any
  width?: number // 页面宽
  height?: number // 页面高
  eventType?: string // 触发事件类型
  performance?: PerformanceResourceType
}

type commonType = {
  type: string // 类型
  subType: string // 一级类型
}

export type PaintType = commonType & {
  /** 性能条目的名称，通常与特定的性能事件或标记相关联 */
  name: string

  /** 性能条目的类型，如 "mark" 或 "measure" */
  entryType: string

  /** 性能条目的开始时间，表示为自全局时间原点（通常是页面加载开始时）以来的毫秒数 */
  startTime: number

  /** 性能条目的持续时间，单位为毫秒 */
  duration: number

  /** 页面路径 */
  pageUrl: string
}

export type AjaxType = commonType & {
  status: number
  duration: number
  startTime?: number
  endTime?: number
  url?: string
  method?: string
  success: boolean
}

/**
 * PerformanceResourceType 定义了性能资源的详细计时信息。
 * 它通常用于分析页面加载过程中各种资源的加载性能。
 */
export type PerformanceResourceType = commonType & {
  /** 资源的名称或 URL */
  name: string

  /** DNS 查询所花费的时间，单位为毫秒 */
  dns: number

  /** 请求的总持续时间，从开始到结束，单位为毫秒 */
  duration: number

  /** 请求使用的协议，如 HTTP 或 HTTPS */
  protocol: string

  /** 重定向所花费的时间，单位为毫秒 */
  redirect: number

  /** 资源的大小，单位为字节 */
  resourceSize: number

  /** 响应体的大小，单位为字节 */
  responseBodySize: number

  /** 响应头的大小，单位为字节 */
  responseHeaderSize: number

  /** 资源类型，如 "script", "css" 等 */
  sourceType: string

  /** 请求开始的时间，通常是一个高精度的时间戳 */
  startTime: number

  /** 资源的子类型，用于进一步描述资源 */
  subType: string

  /** TCP 握手时间，单位为毫秒 */
  tcp: number

  /** 传输过程中实际传输的字节大小，单位为字节 */
  transferSize: number

  /** 首字节时间 (Time to First Byte)，从请求开始到接收到第一个字节的时间，单位为毫秒 */
  ttfb: number

  /** 类型，通常用于描述性能记录的类型，如 "performance" */
  type: string
}

export type ResourceErrorType = commonType & {
  src: string // 资源路径
  pageUrl: string // 页面路径
  tagName: string // 标签名
  path: string // 节点路径
}

export type JsErrorType = commonType & {
  msg: string | Event // 错误信息
  src?: string // 资源路径，打包后到路径
  lineNo?: number // 错误行号
  columnNo?: number // 错误列号
  stack?: any[] // 错误堆栈
  pageUrl: string // 页面路径
}

export type PromiseErrorType = commonType & {
  msg: string | Event // 错误信息
  stack?: any[] // 错误堆栈
  pageUrl: string // 页面路径
}
