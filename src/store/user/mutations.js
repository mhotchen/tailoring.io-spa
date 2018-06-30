import { extend } from 'quasar'

export const setUser = (state, payload) => {
  state.user = extend(true, {}, payload)
  delete state.user.data.companies // companies aren't needed (yet) so discard them to improve memory consumption.
  delete state.user.meta // It isn't necessary to store the JWT token
  state.loaded = true
}
export const unsetUser = (state) => {
  state.user = null
  state.loaded = false
}
export const setUserIsLoading = (state, isLoading) => {
  state.loading = isLoading
}
