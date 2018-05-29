export const setUser = (state, payload) => {
  state.user = payload
  state.loaded = true
}
export const unsetUser = (state) => {
  state.user = null
  state.loaded = false
}
export const setUserIsLoading = (state, isLoading) => {
  state.loading = isLoading
}
