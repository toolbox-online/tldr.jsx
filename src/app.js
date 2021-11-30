//@flow

const Version  = process.env.VERSION
const Revision = process.env.REVISION

/*******************************************************************************
 * Imports
 *******************************************************************************/

import Mixpanel from 'tldr/Analytics'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/takeUntil'

import type { History, Location as HistoryLocation } from 'history'
import type { State } from 'tldr/Tldr'

import ObservableHistory from 'tldr/lib/observable.history'
import * as HistoryLib from 'history'
console.log(HistoryLib)

import Index from 'tldr/Index'
import Location from 'tldr/Location'
import Page from 'tldr/Page'

import type { State as StateType } from 'tldr/Tldr'
import type { Page as PageType, Options as PageOptions } from 'tldr/Page'

import render from 'tldr/render'

/*******************************************************************************
 * Private
 *******************************************************************************/

let __history: History = HistoryLib.createBrowserHistory()
let history: Observable = ObservableHistory(__history)

let log  = (...args: any[]): void => {
  (process.env.NODE_ENV !== "production") && console.log((new Date()).toTimeString().split(' ')[0], ...args)
}
let error: Function = log.bind("ERROR")
let done:  Function = log.bind("DONE")

let ga: Function = window.ga
let trackGoogleAnalyticsVisits = ({params: {location}}: StateType): void => {
  if ( ga && typeof ga === 'function' ) {
    ga('set', 'page', location.pathname)
    ga('send', 'pageview')
  }
}

let initMixpanel = ({params: {debug}}: StateType): void => {
  // Mixpanel.init(process.env.MIXPANEL_TOKEN, {
  //   debug
  // })
}

let track = ({params: {command: {platform, name}}, found}: StateType): void => {
  if(name) {
    // Mixpanel.track("Search", {
    //   "Query":    `${platform}/${name}`,
    //   "Found":    !!found,
    //   "Command":  name,
    //   "Platform": platform
    // })
  }
}

// Extend state
let addFound = (state: StateType, found: boolean): StateType => ({...state, found}: StateType)
let addPage  = (state: StateType, page: PageType): StateType => ({...state, page}: StateType)

// Filters
let byFound    = ({params, found}: StateType): mixed   => found
let byNotFound = ({params, found}: StateType): boolean => !found

// Merge Mappers
let findInIndex = ({params}: StateType): Observable =>
  Index(params.index).search(params.command)

let buildState = ({params, found}: StateType): Observable => {
  let options: PageOptions = {
    branch: params.index.branch,
    repository: 'tldr-pages/tldr',
    timeout: 5000
  }
  return Page(options).get(params.command)
}

let buildInitialState = (location: HistoryLocation): StateType => ({
  params: {
    _: { Version, Revision },
    location: location,
    history: __history,
    index: Location.toIndex(location),
    command: Location.toCommand(location),
    debug: Location.isDebugging(location)
  }
}: StateType)


/*******************************************************************************
 * Public API
 *******************************************************************************/

let StateObservable: Observable = Observable
  .from(history)
  .debounceTime(300)
  .distinctUntilChanged()
  .map(buildInitialState)
  .do(trackGoogleAnalyticsVisits)
  .do(initMixpanel)
  .do(render)

let StateFromIndex: Observable = Observable
  .from(StateObservable)
  .mergeMap(findInIndex, addFound)
  .distinctUntilChanged()

let Tracker: Observable = Observable
  .from(StateFromIndex)
  .do(track)
  .subscribe(log, error, done)

// Subscribe to commands found and fetch them
let CommandFound: Observable = Observable
  .from(StateFromIndex)
  .filter(byFound)
  .mergeMap(buildState, addPage)
  .do(render)
  .subscribe(log, error, done)

// Subscribe to commands not being found
let CommandNotFound: Observable = Observable
  .from(StateFromIndex)
  .filter(byNotFound)
  .do(render)
  .subscribe(log, error, done)
