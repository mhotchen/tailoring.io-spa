export const set = (state, payload) => {
  state.id = payload.id
  state.email = payload.email
  state.status = payload.status
  state.access_token = payload.access_token
  state.companies = payload.companies.map(company => {
    return {
      id: company.data.id,
      name: company.data.name
    }
  })
}
