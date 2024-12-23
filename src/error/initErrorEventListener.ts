import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { report } from '../common/report'
import {
  getErrorUid,
  getPathToElement,
  parseStackFrames
} from '../common/utils'
import {
  JsErrorType,
  PromiseErrorType,
  ResourceErrorTarget,
  ResourceErrorType
} from '../types'

const getErrorType = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) {
    return TraceSubTypeEnum.resource
  }
  return event.message === 'Script error.'
    ? TraceSubTypeEnum.cors
    : TraceSubTypeEnum.js
}

const initResourceError = (e: Event) => {
  // 通过 e.target 确定错误是发生在哪个资源上
  const target = e.target as ResourceErrorTarget
  const src = target.src || target.href
  const type = e.type
  const subType = TraceSubTypeEnum.resource
  const tagName = target.tagName
  const message = ''
  const html = target.outerHTML
  const path = getPathToElement(target)
  const reportData: ResourceErrorType = {
    type,
    subType,
    tagName,
    message,
    html,
    src,
    pageUrl: window.location.href,
    path,
    errId: getErrorUid(`${subType}-${message}-${src}`)
  }
  report(reportData)
}

const initJsError = (e: ErrorEvent) => {
  const {
    colno: columnNo,
    lineno: lineNo,
    type,
    message,
    filename: src,
    error
  } = e
  const subType = TraceSubTypeEnum.js
  const stack = parseStackFrames(error)
  const reportData: JsErrorType = {
    columnNo,
    lineNo,
    type,
    message,
    src,
    subType,
    pageUrl: window.location.href,
    stack,
    errId: getErrorUid(`${subType}-${message}-${src}`)
  }
  report(reportData)
}

const initCorsError = (e: ErrorEvent) => {
  const { message } = e
  const type = TraceTypeEnum.error
  const subType = TraceSubTypeEnum.cors
  const reportData = {
    type,
    subType,
    message
  }
  report(reportData)
}

const initErrorEventListener = () => {
  window.addEventListener(
    'error',
    (e: ErrorEvent | Event) => {
      const errorType = getErrorType(e)
      switch (errorType) {
        case TraceSubTypeEnum.resource:
          initResourceError(e)
          break
        case TraceSubTypeEnum.js:
          initJsError(e as ErrorEvent)
          break
        case TraceSubTypeEnum.cors:
          initCorsError(e as ErrorEvent)
          break
        default:
          break
      }
    },
    true
  )
  window.addEventListener(
    'unhandledrejection',
    (e: PromiseRejectionEvent) => {
      const stack = parseStackFrames(e.reason)
      const reportData: PromiseErrorType = {
        type: TraceTypeEnum.error,
        subType: TraceSubTypeEnum.promise,
        message: e.reason.message,
        stack,
        pageUrl: window.location.href,
        errId: getErrorUid(`'promise'-${e.reason.message}`)
      }
      // todo 发送错误信息
      report(reportData)
    },
    true
  )
}

export default initErrorEventListener
