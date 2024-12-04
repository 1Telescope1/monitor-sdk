import { getConfig } from '../common/config'
import { report } from '../common/report'
import { whiteScreenType } from '../types'

let initTime = 0
const whiteScreenTime = 6000

// 定义外层容器元素的集合
const { containerElements, skeletonElements } = getConfig()
// 页面加载完毕
function onload(callback: any) {
  if (document.readyState === 'complete') {
    callback()
  } else {
    window.addEventListener('load', callback)
  }
}

// 选中dom的名称
function getSelector(element: Element) {
  if (element.id) {
    return '#' + element.id
  } else if (element.className) {
    // div home => div.home
    return (
      '.' +
      element.className
        .split(' ')
        .filter(item => !!item)
        .join('.')
    )
  } else {
    return element.nodeName.toLowerCase()
  }
}
// 监听页面白屏
function whiteScreen() {
  // 容器元素个数
  let emptyPoints = 0

  // 是否为容器节点
  function isContainer(element: Element) {
    const selector = getSelector(element)
    if (
      containerElements.indexOf(selector) != -1 ||
      skeletonElements.some(skeletonSelector =>
        element.matches(skeletonSelector)
      )
    ) {
      emptyPoints++
    }
  }

  function main() {
    // 页面加载完毕初始化
    for (let i = 1; i <= 9; i++) {
      const xElements = document.elementsFromPoint(
        (window.innerWidth * i) / 10,
        window.innerHeight / 2
      )
      const yElements = document.elementsFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10
      )
      isContainer(xElements[0])
      // 中心点只计算一次
      if (i != 5) {
        isContainer(yElements[0])
      }
    }
    // 17个点都是容器节点算作白屏
    if (emptyPoints != 17) {
      initTime = new Date().getTime()
      // if (window.whiteLoopTimer) {
      //   clearTimeout(window.whiteLoopTimer)
      //   window.whiteLoopTimer = null
      // }
    } else {
      const nowTime = new Date().getTime()
      if (nowTime - initTime >= whiteScreenTime) {
        const reportData: whiteScreenType = {
          type: 'exception',
          subType: 'whiteScreen',
          pageUrl: window.location.href,
          timestamp: nowTime
        }
        console.error('页面白屏')
        report(reportData)
        if (window.whiteLoopTimer) {
          clearTimeout(window.whiteLoopTimer)
          window.whiteLoopTimer = null
        }
      }
      // 开启轮询
      // if (!window.whiteLoopTimer) {
      //   whiteSceenLoop()
      // }
    }
  }
  onload(main)
}

export default function whiteSceenLoop() {
  initTime = new Date().getTime()
  window.whiteLoopTimer = setInterval(() => {
    whiteScreen()
  }, 2000)
}
