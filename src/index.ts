import performance from './performance'
import error from './error'
import { setConfig } from './common/config'
import { ConfigType } from './types'
import Behavior from './behavior'

export function init(options: ConfigType) {
  setConfig(options)
  // performance();
  // error();
  // behavior();
}

export default {
  performance,
  error,
  Behavior
}
