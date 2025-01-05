export type ConfigType = {
  url: string
  projectName: string
  appId: string
  userId: string
  batchSize: number
  isAjax: boolean
  containerElements: string[]
  skeletonElements: string[]
  [key: string]: string | boolean | number | string[] // 添加索引签名
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
  timestamp: number
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

export type resourceType = commonType & {
  resourceList: PerformanceResourceType[]
}

export type AjaxType = commonType & {
  status: number
  duration: number
  startTime?: number
  endTime?: number
  url?: string
  method?: string
  success: boolean
  pageUrl: string
  params: string
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

  pageUrl: string
}

export type ErrorCommonType = {
  errId: string
  state: any[]
  timestamp: number
}

export type ResourceErrorTarget = {
  src?: string
  href?: string
  tagName?: string
  outerHTML?: string
}

export type ResourceErrorType = commonType &
  ErrorCommonType & {
    message: string | Event // 错误信息
    src?: string // 资源路径
    pageUrl: string // 页面路径
    tagName?: string // 标签名
    html: any
    path: string // 节点的dom位置
  }

export type JsErrorType = commonType &
  ErrorCommonType & {
    message: string | Event // 错误信息
    src?: string // 资源路径，打包后到路径
    lineNo?: number // 错误行号
    columnNo?: number // 错误列号
    stack: any[] // 错误堆栈
    pageUrl: string // 页面路径
    eventData: string
  }

export type PromiseErrorType = commonType &
  ErrorCommonType & {
    message: string | Event // 错误信息
    stack?: any[] // 错误堆栈
    pageUrl: string // 页面路径
    eventData: string
  }

export type VueErrorType = commonType &
  ErrorCommonType & {
    message: string
    stack: any[]
    pageUrl: string
    info: string
    componentName: string
    src: string
    eventData: string
  }

export type ReactErrorType = VueErrorType

export type PageInformation = {
  host: string
  hostname: string
  href: string
  protocol: string
  origin: string
  port: string
  pathname: string
  search: string
  hash: string
  // 网页标题
  title: string
  // 浏览器的语种 (eg:zh) ; 这里截取前两位，有需要也可以不截取
  language: string
  // 用户 userAgent 信息
  userAgent?: string
  // 屏幕宽高 (eg:1920x1080)  屏幕宽高意为整个显示屏的宽高
  winScreen: string
  // 文档宽高 (eg:1388x937)   文档宽高意为当前页面显示的实际宽高（有的同学喜欢半屏显示）
  docScreen: string
  // 页面加载方式
  pageLoadType: string
}

// 这里参考了 谷歌GA 的自定义埋点上报数据维度结构
export type customAnalyticsData = commonType & {
  // 埋点key
  eventKey: string
  // 触发条件 click expose
  eventAction: string
  // 事件值 与事件相关的数值
  eventValue?: any
}

export type originInfoType = {
  referrer: string
  // 0 (TYPE_NAVIGATE): 页面通过常规导航加载，例如通过输入 URL 或点击链接。
  // 1 (TYPE_RELOAD): 页面通过重新加载（刷新）加载。
  // 2 (TYPE_BACK_FORWARD): 页面通过浏览器的前进或后退按钮加载。
  // 255 (TYPE_RESERVED): 任何其他类型的导航。
  navigationType: string | number
}

export type PvInfoType = commonType & {
  timestamp: number
  pageInfo: PageInformation
  originInfo: originInfoType
}

export type RouterChangeType = commonType & {
  jumpType: string
  timestamp: number
  pageUrl: string
  pageTime: number
}

export type TargetInfoType = commonType & {
  path: string
  tagName: string
  textContent: string | null
  pageUrl: string
  timestamp: number
}

export type whiteScreenType = commonType & {
  pageUrl: string
  timestamp: number
  state: any[]
  eventData: string
}

export type stutterStype = commonType & {
  pageUrl: string
  timestamp: number
  state: any[]
  eventData: string
}

export type CrashType = commonType & {
  pageUrl: string
  timestamp: number
  state: any[]
  eventData: string
}

export type RecordEventScope = {
  scope: string
  eventList: any[]
}
