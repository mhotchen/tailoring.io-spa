import { Cookies, SessionStorage } from 'quasar'

const KEY = 'access_token'

export const loadAccessTokenFromStorage = ({ commit }) => {
  let accessToken = null

  if (SessionStorage.has(KEY)) {
    accessToken = SessionStorage.get.item(KEY)
  } else if (Cookies.has(KEY)) {
    accessToken = Cookies.get(KEY)
  }

  commit('setAccessToken', accessToken || null)
}

export const storeAccessTokenInStorage = ({ getters }, useCookies) => {
  if (useCookies) {
    Cookies.set(KEY, getters['accessToken'], { expires: 30, path: '/' })
  }
  SessionStorage.set(KEY, getters['accessToken'])
}

export const clearAccessTokenFromStorage = ({ commit }) => {
  if (Cookies.has(KEY)) {
    Cookies.remove(KEY, { path: '/' })
  }

  if (SessionStorage.has(KEY)) {
    SessionStorage.remove(KEY)
  }

  commit('setAccessToken', null)
}
