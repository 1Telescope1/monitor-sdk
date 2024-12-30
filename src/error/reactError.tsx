import React, { ReactNode } from 'react'
import { lazyReportBatch } from '../common/report'
import {
  getErrorUid,
  getReactComponentInfo,
  parseStackFrames
} from '../common/utils'
import { ReactErrorType } from '../types'
import { TraceSubTypeEnum, TraceTypeEnum } from '../common/enum'
import { getBehaviour, getRecordScreenData } from '../behavior'

interface ErrorBoundaryProps {
  Fallback: ReactNode // ReactNode 表示任意有效的 React 内容
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

let err = {}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true })
    const { componentName, url: src } = getReactComponentInfo(errorInfo)
    const type = TraceTypeEnum.error
    const subType = TraceSubTypeEnum.react
    const message = error.message
    const stack = parseStackFrames(error)
    const pageUrl = window.location.href
    const errId = getErrorUid(`${subType}-${message}-${src}`)
    const info = error.message
    const behavior = getBehaviour()
    const state = behavior?.breadcrumbs?.state || []
    const eventData = getRecordScreenData()
    const reportData: ReactErrorType = {
      type,
      subType,
      stack,
      pageUrl,
      message,
      errId,
      componentName,
      info,
      src,
      state,
      timestamp: new Date().getTime(),
      eventData
    }
    err = reportData
    lazyReportBatch(reportData)
  }

  render() {
    const { Fallback } = this.props    
    if (this.state.hasError) {
      // @ts-ignore
      return <Fallback error={err}/>
    }

    return this.props.children
  }
}

export default ErrorBoundary
