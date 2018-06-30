export const loadCompanyFromUserApiCall = async ({ commit }, apiPromise) => {
  commit('setCompanyIsLoading', true)
  try {
    commit('setCompany', (await apiPromise).data.data.companies[0])
  } finally {
    commit('setCompanyIsLoading', false)
  }
}

export const loadCompany = async ({ commit }, apiPromise) => {
  commit('setCompanyIsLoading', true)
  try {
    commit('setCompany', (await apiPromise).data)
  } finally {
    commit('setCompanyIsLoading', false)
  }
}
