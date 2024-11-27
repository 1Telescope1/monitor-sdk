import { report } from '../common/report'

interface Props {
  children: any // 使用 any 类型来避免直接依赖 ReactNode
}

interface State {
  hasError: boolean
}

// @ts-ignore
class ErrorBoundary implements React.Component<Props, State> {
  state: State = { hasError: false }

  constructor(public props: Props) {}

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.log(error)
    console.log(info)

    const reportData = {
      error: error?.stack,
      info: info.componentStack,
      subType: 'react',
      type: 'error',
      startTime: window.performance.now(),
      pageURL: window.location.href
    }
    // 假设 report 是一个全局函数或从其他地方导入
    report(reportData)
    console.log(reportData, 'react')
  }

  render() {
    if (this.state.hasError) {
      return 'Something went wrong.' // 返回一个简单的字符串作为回退 UI
    }

    return this.props.children
  }
}

export default ErrorBoundary
