import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '../store'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

Router.beforeEach((to, from, next) => {
  let promises = []
  if (!store.getters['user/userIsLoaded'] && store.getters['accessToken/isAccessTokenSet']) {
    let request = Vue.prototype.$axios.get('/users/me')
    promises.push(store.dispatch('company/loadCompanyFromUserApiCall', request))
    promises.push(store.dispatch('user/loadUser', request))
  }

  Promise.all(promises)
    .then(p => {
      let userIsActive = store.getters['user/userIsActive']
      switch (true) {
        case userIsActive && to.matched.some(record => record.meta.requiresUser === true):
        case !userIsActive && to.matched.some(record => record.meta.requiresUser === false):
          next()
          break
        case !userIsActive && to.matched.some(record => record.meta.requiresUser === true):
          next({ name: 'login' })
          break
        case userIsActive && to.matched.some(record => record.meta.requiresUser === false):
          next({ name: 'index' })
          break
        default:
          next()
      }
    })
    .catch(error => {
      if (!('response' in error)) {
        throw error
      }
      switch (error.response.status) {
        case 401:
        case 402:
        case 403:
        case 404:
          Vue.prototype.$axios.defaults.headers.common['Authorization'] = null
          store.commit('user/unsetUser')
          store.commit('company/unsetCompany')
          store.dispatch('accessToken/clearAccessTokenFromStorage')
          next({ name: 'login' })
          break
        default:
          throw error
      }
    })
})

export default Router
