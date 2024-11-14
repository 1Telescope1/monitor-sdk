import fetch from './fetch'
import observerEntries from './observerEntries'
import observerLCP from './observerLCP'
import observerFCP from './observerFCP'
import observerLoad from './observerLoad'
import observerPaint from './observerPaint'
import xhr from './xhr'

export default function performance() {
  fetch()
  observerEntries()
  observerLCP()
  observerFCP()
  observerLoad()
  observerPaint()
  xhr()
}
