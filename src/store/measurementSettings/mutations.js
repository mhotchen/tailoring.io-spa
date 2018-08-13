export const setMeasurementSettings = (state, payload) => {
  state.settings = payload
  state.loaded = true
}

export const createOrReplaceMeasurementSetting = (state, payload) => {
  let found = false
  state.settings = state.settings.map(setting => {
    if (setting.data.id === payload.data.id) {
      found = true
      return payload
    } else {
      return setting
    }
  })

  if (!found) {
    state.settings.unshift(payload)
  }
}

export const removeMeasurementSetting = (state, payload) => {
  state.settings = state.settings.filter(setting => setting.data.id !== payload)
}
