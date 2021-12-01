//@flow

/*******************************************************************************
 * Imports
 *******************************************************************************/

import { Observable } from 'rxjs/Observable'
import { from } from 'rxjs/observable/from'
import { concat } from 'rxjs/operator/concat'
import type { AjaxResponse } from 'rxjs/observable/dom/ajax'

import GithubAPI from 'tldr/Github'
import type {
              Github,
              Get as GithubGetOptions,
              Options as GithubOptions
            } from 'tldr/Github'

import type { Command } from 'tldr/Command'

/*******************************************************************************
 * Type Definitions
 *******************************************************************************/

export type Options = GithubOptions

type DataError = {
  message: string;
  status:  number;
}

type Error = {
  error: DataError;
}

type Data = {
  html_url: string;
  content:  string;
}

export type Path = string

export type Page = {
  cmd?:  Command;
  path:  Path;
  body:  string;
}

type Module = {
  get(cmd: Command): Observable;
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
/*******************************************************************************
 * Public API
 *******************************************************************************/

export default (opts: Options): Module => {
  let { repository, branch }: Options = opts

  let Repo: Github = GithubAPI({
    repository: repository
  })

  let options = ({lang='',name, platform}: Command): GithubGetOptions => ({
    path: `pages${lang.length?'.'+lang:''}/${platform}/${name}.md`,
    branch
  })

  let get = (cmd: Command): Observable => {
    let page: Observable =  Repo.get(options(cmd))

    let found: Observable = from(page)
      .filter(byStatus(200))
      .pluck('response')
      .map(toPage)

    let error: Observable = from(page)
      .filter(not(byStatus(200)))
      .map(toError)

    return concat.apply(found, [error])
  }

  let not = (f: Function): Function =>
    (res: AjaxResponse): boolean => ! f(res)

  let byStatus = (...statuses: number[]): Function =>
    (res: AjaxResponse): boolean =>
      statuses.indexOf(res.status) !== -1

  let toError = (data: DataError): Error => ({
    error: data
  })

  let toPage = (data: Data): Page => ({
    path: data.html_url,
    body: b64_to_utf8(data.content)
  })

  return { get: get }
}
