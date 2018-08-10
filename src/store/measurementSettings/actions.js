export const loadMeasurementSettings = async ({ commit }, apiPromise) => {
  commit('setMeasurementSettings', (await apiPromise).data.data)
}

export const loadMeasurementSetting = async ({ commit }, apiPromise) => {
  commit('createOrReplaceMeasurementSetting', (await apiPromise).data)
}
