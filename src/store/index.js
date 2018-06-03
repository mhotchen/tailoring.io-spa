import Vue from 'vue'
import Vuex from 'vuex'

import accessToken from './accessToken'
import customer from './customer'
import customers from './customers'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    accessToken,
    customer,
    customers,
    user
  }
})
