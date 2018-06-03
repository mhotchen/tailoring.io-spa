export const loadCustomer = async ({ commit }, apiPromise) => {
  commit('setCustomer', (await apiPromise).data)
}

export const hydrateFromCustomers = ({ commit, getters, rootGetters }, id) => {
  if (getters['getCustomerId'] === id || !rootGetters['customers/hasCustomer'](id)) {
    return
  }

  commit('setCustomer', rootGetters['customers/getCustomer'](id))
}
