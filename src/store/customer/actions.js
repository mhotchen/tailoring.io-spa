export const loadCustomer = async (context, apiPromise) => {
  context.commit('setCustomer', (await apiPromise).data)
}
