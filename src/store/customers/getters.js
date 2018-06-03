export const getLastInsertedCustomers = (state) => state.lastInserted
export const hasCustomer = (state) => (id) => id in state
export const getCustomer = (state) => (id) => id in state ? state[id] : {}
export const getCustomerName = (state) => (id) => id in state ? state[id].data.name : null
export const getCustomerEmail = (state) => (id) => id in state ? state[id].data.email : null
export const getCustomerTelephone = (state) => (id) => id in state ? state[id].data.telephone : null
