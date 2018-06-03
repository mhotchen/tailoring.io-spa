export const loadCustomers = async ({ commit }, apiPromise) => {
  commit('overwriteCustomers', (await apiPromise).data.data)
}
