import React, { ReactNode } from 'react'
import { report } from '../common/report'

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

    const reportData = {
      type: 'error',
      subType: 'react',
      stack: error.stack,
      componentStack: errorInfo.componentStack
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
