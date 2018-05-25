import { Cookies, SessionStorage } from 'quasar'

export const store = ({ commit, state }, { user, useCookie }) => {
  if (useCookie) {
    Cookies.set('user', user, { expires: 30, path: '/' })
  }

  SessionStorage.set('user', user)

  commit('set', user)
}
