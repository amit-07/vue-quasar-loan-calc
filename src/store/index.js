import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import loanStore from './loanStore'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      loanStore
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./loanStore'], () => {
      const newLoanStore = require('./loanStore').default
      Store.hotUpdate({ modules: { loanStore: newLoanStore } })
    })
  }

  return Store
}
