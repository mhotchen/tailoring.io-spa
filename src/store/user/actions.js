export const loadUser = async ({ commit }, apiPromise) => {
  commit('setUserIsLoading', true)
  try {
    commit('setUser', (await apiPromise).data)
  } finally {
    commit('setUserIsLoading', false)
  }
}
