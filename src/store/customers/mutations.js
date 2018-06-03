export const overwriteCustomers = (state, payload) => {
  state.lastInserted.forEach(id => {
    delete state[id]
  })

  state.lastInserted = []

  payload.forEach((customer) => {
    state.lastInserted.push(customer.data.id)
    state[customer.data.id] = customer
  })
}
