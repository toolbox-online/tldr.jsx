//@flow

/*******************************************************************************
 * Imports
 *******************************************************************************/

import { parse } from 'query-string'

import compact from 'tldr/lib/array.compact'

import type { Command } from 'tldr/Command'
import type { Options } from 'tldr/Github'

import type { Location } from 'history'

/*******************************************************************************
 * Public API
 *******************************************************************************/

let toCommand = (location: Location): Command => {
  let base = 'tldr-pages';
  let path = location.pathname.substring(location.pathname.indexOf(base)+base.length)
  let parts = compact(path.split('/'))
  let search = parse(location.search)
  let res: Command
  switch(parts.length) {
    case 2:
      res = { name: parts[1], platform: parts[0], lang: search.lang }
    break
    case 1:
    default:
      res = { name: parts[0], platform: "common", lang: search.lang }
    break
  }
  return res
}

let toIndex = (location: Location): Options => {
  return Object.assign({
      branch: 'master',
      repository: 'tldr-pages/tldr-pages.github.io',
      timeout: 5000
    }, parse(location.search))
}

let isDebugging = (location: Location): boolean => {
  let { debug } = parse(location.search)
  return !!debug
}

export default {
  toCommand,
  toIndex,
  isDebugging
}
