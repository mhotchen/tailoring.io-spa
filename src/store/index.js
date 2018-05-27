import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import accessToken from './accessToken'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    accessToken
  }
})

export default store
