import { report } from '../common/report'
import { getPathToElement, parseStackFrames } from '../common/utils'
import {
  JsErrorType,
  PromiseErrorType,
  ResourceErrorTarget,
  ResourceErrorType
} from '../types'

enum ErrorEnum {
  RESOURCE = 'resource',
  JS = 'js',
  CORS = 'cors'
}

const getErrorType = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) {
    return ErrorEnum.RESOURCE
  }
  return event.message === 'Script error.' ? ErrorEnum.CORS : ErrorEnum.JS
}

const initResourceError = (e: Event) => {
  // 通过 e.target 确定错误是发生在哪个资源上
  const target = e.target as ResourceErrorTarget
  const src = target.src || target.href
  const type = e.type
  const subType = ErrorEnum.RESOURCE
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
    path
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
  const subType = ErrorEnum.JS
  const stack = parseStackFrames(error)
  const reportData: JsErrorType = {
    columnNo,
    lineNo,
    type,
    message,
    src,
    subType,
    pageUrl: window.location.href,
    stack
  }
  report(reportData)
}

const initCorsError = (e: ErrorEvent) => {
  const { message } = e
  const type = 'error'
  const subType = ErrorEnum.CORS
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
        case ErrorEnum.RESOURCE:
          initResourceError(e)
          break
        case ErrorEnum.JS:
          initJsError(e as ErrorEvent)
          break
        case ErrorEnum.CORS:
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
        type: 'error',
        subType: 'promise',
        message: e.reason.message,
        stack,
        pageUrl: window.location.href
      }
      // todo 发送错误信息
      report(reportData)
    },
    true
  )
}

export default initErrorEventListener
