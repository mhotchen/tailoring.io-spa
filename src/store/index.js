import Vue from 'vue'
import Vuex from 'vuex'

import accessToken from './accessToken'
import user from './user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    accessToken,
    user
  }
})

export default store
