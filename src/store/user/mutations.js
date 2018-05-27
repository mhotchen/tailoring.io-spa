export const setUser = (state, payload) => {
  state.user.id = payload.id
  state.user.email = payload.email
  state.user.status = payload.status
  state.user.companies = payload.companies.map(company => {
    return {
      id: company.data.id,
      name: company.data.name
    }
  })
}
export const unsetUser = (state) => {
  state.user.id = null
  state.user.email = null
  state.user.status = null
  state.user.companies = []
}
export const setUserIsLoading = (state, isLoading) => { state.isLoading = isLoading }
