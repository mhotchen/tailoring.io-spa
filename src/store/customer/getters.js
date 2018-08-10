import { MEASUREMENT_PROFILE_TYPE_BODY } from '../../types/measurementProfileType'

export const getCustomer = (state) => state.loaded ? state.customer : {}
export const getCustomerId = (state) => state.loaded ? state.customer.data.id : null
export const getCustomerName = (state) => state.loaded ? state.customer.data.name : null
export const getCustomerEmail = (state) => state.loaded ? state.customer.data.email : null
export const getCustomerTelephone = (state) => state.loaded ? state.customer.data.telephone : null
export const getCustomerNotes = (state) => state.loaded ? state.customer.data.notes : null

export const hasCustomerNotes = (state) => state.loaded ? state.customer.data.notes.length > 0 : false

export const getCustomerNoteValue = (state) => (note) => note.data.note
export const getCustomerNoteCreatedAt = (state) => (note) => new Date(note.data.created_at)

export const getCustomerBodyMeasurementProfile = (state) => state.loaded && state.customer.data.measurement_profiles.length
  ? state.customer.data.measurement_profiles.reduce((l, r) => l.data.type === MEASUREMENT_PROFILE_TYPE_BODY ? l : r)
  : null

export const getCustomerMeasurementProfile = (state) => (id) => state.loaded && state.customer.data.measurement_profiles.length
  ? state.customer.data.measurement_profiles.reduce((l, r) => l.data.id === id ? l : r)
  : null

export const getCustomerMeasurementProfilesByGarment = (state) => (garment) => state.loaded && state.customer.data.measurement_profiles.length
  ? state.customer.data.measurement_profiles.filter(p => p.data.garment === garment)
  : []

// TODO: these should eventually sit in their own store
export const getMeasurementProfileId = (state) => (profile) => profile.data.id
export const getMeasurementProfileGarment = (state) => (profile) => profile.data.garment
export const getMeasurementProfileType = (state) => (profile) => profile.data.type
export const getCurrentMeasurementValue = (state, getters) => (profileId, settingId) => {
  if (!state.loaded) {
    return null
  }
  let profile = getters['getCustomerMeasurementProfile'](profileId)
  if (!profile) {
    return null
  }

  return profile.data.current_measurements[settingId] !== undefined
    ? profile.data.current_measurements[settingId].data.value
    : null
}
export const getCurrentMeasurementComment = (state, getters) => (profileId, settingId) => {
  if (!state.loaded) {
    return null
  }
  let profile = getters['getCustomerMeasurementProfile'](profileId)
  if (!profile) {
    return null
  }

  if (profile.data.current_measurements[settingId] !== undefined) {
    return profile.data.current_measurements[settingId].data.comment
  }
}

export const measurementProfileHasCommits = (state) => (profile) => profile.data.commits.length > 0
