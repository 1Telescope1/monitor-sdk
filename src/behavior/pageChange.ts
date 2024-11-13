import { report } from '../common/report'
import { generateUniqueId } from '../common/utils'
export default function pageChange() {
  // hash histroy
  let oldUrl = ''
  window.addEventListener(
    'hashchange',
    function (event) {
      console.error('hashchange', event)
      const newUrl = event.newURL
      const reportData = {
        form: oldUrl,
        to: newUrl,
        type: 'behavior',
        subType: 'hashchange',
        startTime: performance.now(),
        uuid: generateUniqueId()
      }
      report(reportData)
      oldUrl = newUrl
    },
    true
  )

  let from = ''
  window.addEventListener(
    'popstate',
    function (event) {
      console.error('popstate', event)
      const to = window.location.href
      const reportData = {
        form: from,
        to,
        type: 'behavior',
        subType: 'popstate',
        startTime: performance.now(),
        uuid: generateUniqueId()
      }
      report(reportData)
      from = to
    },
    true
  )
}
