import { report } from '../common/report'
import { generateUniqueId } from '../common/utils'

export default function pv() {
  const reportData = {
    type: 'behavior',
    subType: 'pv',
    startTime: performance.now(),
    pageUrl: window.location.href,
    referror: document.referrer,
    uuid: generateUniqueId()
  }
  report(reportData)
}
