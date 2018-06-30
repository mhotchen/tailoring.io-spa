import axios from 'axios'
import store from '../store'

export default ({ Vue }) => {
  let instance = axios.create({
    baseURL: process.env.API_BASE_URL
  })

  store.dispatch('accessToken/loadAccessTokenFromStorage')
  if (store.getters['accessToken/isAccessTokenSet']) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${store.getters['accessToken/accessToken']}`
  }

  Vue.prototype.$axios = instance
}
