import Vue from 'vue'
import Vuex from 'vuex'

import accessToken from './accessToken'
import company from './company'
import customer from './customer'
import customers from './customers'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    accessToken,
    company,
    customer,
    customers,
    user
  }
})
