import { extend } from 'quasar'

export const setCompany = (state, payload) => {
  state.company = extend(true, {}, payload)
  state.loaded = true
}
export const setCompanyUnitOfMeasurement = (state, unitOfMeasurement) => {
  state.company.data.unit_of_measurement = unitOfMeasurement
}
export const unsetCompany = (state) => {
  state.company = null
  state.loaded = false
}
export const setCompanyIsLoading = (state, isLoading) => {
  state.loading = isLoading
}
