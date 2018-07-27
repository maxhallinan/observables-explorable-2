import { run, } from '@cycle/run'
import { makeDOMDriver, } from '@cycle/dom'
import { App, } from './app'

const main = App

window.ObservablesExplorable2 = {
  run: (appContainer) => {
    const drivers = {
      DOM: makeDOMDriver(appContainer),
    }

    run(main, drivers);
  }
};
