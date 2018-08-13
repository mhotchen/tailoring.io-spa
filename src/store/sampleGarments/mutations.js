export const setSampleGarments = (state, payload) => {
  state.garments = payload
  state.loaded = true
}

export const createOrReplaceSampleGarment = (state, payload) => {
  let found = false
  state.garments = state.garments.map(garment => {
    if (garment.data.id === payload.data.id) {
      found = true
      return payload
    } else {
      return garment
    }
  })

  if (!found) {
    state.garments.unshift(payload)
  }
}

export const removeSampleGarment = (state, payload) => {
  state.garments = state.garments.filter(garment => garment.data.id !== payload)
}
