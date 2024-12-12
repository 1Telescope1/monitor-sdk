import { setConfig } from './common/config'
import { ConfigType } from './types'
import Behavior from './behavior'
import Exception from './exception'
import Performance from './performance'
import Error from './error'

function init(options: ConfigType) {
  setConfig(options)
  window.$SDK = {}
}

export default {
  init,
  Performance,
  Error,
  Behavior,
  Exception
}
