import { report } from '../common/report'

export default function click() {
  ;['mousedown', 'touchstart'].forEach(eventType => {
    window.addEventListener(eventType, e => {      
      
      const target = e.target as HTMLElement
      if (target.tagName) {
        const reportData = {
          // scrollTop: document.documentElement.scrollTop,
          type: 'behavior',
          subType: 'click',
          target: target.tagName,
          startTime: e.timeStamp,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          with: target.offsetWidth,
          height: target.offsetHeight,
          eventType
        }
        console.log(e.target, reportData);

        report(reportData)
      }
    }, true)
  })
}
