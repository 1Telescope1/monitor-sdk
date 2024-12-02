// 定义外层容器元素的集合
const containerElements = ['html', 'body', '#app', '#root']
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
    if (containerElements.indexOf(selector) != -1) {
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
      if (window.whiteLoopTimer) {
        clearTimeout(window.whiteLoopTimer)
        window.whiteLoopTimer = null
      }
      console.log('success')
    } else {
      // 开启轮询
      if (!window.whiteLoopTimer) {
        whiteSceenLoop()
      }
    }
    // 通过轮询不断修改之前的检测结果，直到页面正常渲染
    console.log({
      status: emptyPoints == 17 ? 'error' : 'ok'
    })
  }
  onload(main)
}

export default function whiteSceenLoop() {
  window.whiteLoopTimer = setInterval(() => {
    whiteScreen()
  }, 2000)
}
