export const company = state => state.loaded ? state.company : {}
export const companyId = state => state.loaded ? state.company.data.id : ''
export const companyName = state => state.loaded ? state.company.data.name : '...'
export const companyUnitOfMeasurement = state => state.loaded ? state.company.data.unit_of_measurement : null
export const companyIsLoaded = state => state.loaded
export const companyIsLoading = state => state.loading
