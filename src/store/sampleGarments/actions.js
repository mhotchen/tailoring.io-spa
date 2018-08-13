export const loadSampleGarments = async ({ commit }, apiPromise) => {
  commit('setSampleGarments', (await apiPromise).data.data)
}

export const loadSampleGarment = async ({ commit }, apiPromise) => {
  commit('createOrReplaceSampleGarment', (await apiPromise).data)
}
