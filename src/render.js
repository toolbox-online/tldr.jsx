//@flow

import React from 'react'
import ReactDOM from 'react-dom'

import Debug from './components/Debug'
import Nav from './components/Nav'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
import TldrPage from './components/TldrPage'
import Welcome from './components/Welcome'
import PatreonBar from './components/PatreonBar'

import type { History } from 'history'
import type { State } from './Tldr'

let navigate = (history: History) => (path: string) =>
  history.push({...history.location,
               pathname: `/${path.toLowerCase().trim().replace(' ','-')}`})

const Oops = () => (
  <section className="content">
    <h1> 啊欧! 没找到数据! </h1>
    <p> 发生了严重的错误。 </p>
  </section>
)

const Loading = () => (
  <section className="content loading"> 加载中... </section>
)

export default (props: State) => {
  let {found, page, params: {_, debug, command, history}} = props
  try {
    ReactDOM.render((
      <section>
        <Nav navigate={navigate(history)} version={_}/>
        <PatreonBar />
        { !command.name && <Welcome /> }
        { command.name && found === undefined && <Loading /> }
        { command.name && found === false     && <NotFound /> }
        { found && page && !page.error && <TldrPage {...page} /> }
        { found && page &&  page.error && <Oops /> }
        { debug && <Debug {...props} /> }
        <Footer />
      </section>
    ), document.getElementById('tldr'))
  } catch (e) {
    console.log(e)
  }
}
