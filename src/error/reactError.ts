import React, { ReactNode } from 'react'
import { report } from '../common/report'
import {
  getErrorUid,
  getReactComponentInfo,
  parseStackFrames
} from '../common/utils'
import { ReactErrorType } from '../types'

interface ErrorBoundaryProps {
  fallback?: ReactNode // ReactNode 表示任意有效的 React 内容
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true })
    const { componentName, url } = getReactComponentInfo(errorInfo)
    const type = 'error'
    const subType = 'react'
    const message = error.message
    const stack = parseStackFrames(error)
    const pageUrl = window.location.href
    const errId = getErrorUid(`${subType}-${message}-${url}`)
    const info = error.message
    const reportData: ReactErrorType = {
      type,
      subType,
      stack,
      pageUrl,
      message,
      errId,
      componentName,
      info,
      url
    }
    report(reportData)
  }

  render() {
    const { fallback } = this.props

    if (this.state.hasError) {
      return fallback || 'Error'
    }

    return this.props.children
  }
}

export default ErrorBoundary
