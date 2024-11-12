import { deepClone } from './utils.js'

const cache: any[] = []
export function getCache() {
  return deepClone(cache)
}
export function addCache(data: any) {
  cache.push(data)
}
export function clearCache() {
  cache.length = 0
}
