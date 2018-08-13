export const getMeasurementSettings = (state) => state.loaded ? state.settings : []
export const getMeasurementSettingById = (state) => (id) => state.loaded
  ? state.settings.reduce((l, r) => l.data.id === id ? l : r)
  : null
export const getMeasurementSettingsByType = (state) => (type) => state.loaded
  ? state.settings.filter(s => s.data.type === type)
  : []
export const getMeasurementSettingsByGarment = (state) => (garment) => state.loaded
  ? state.settings.filter(s => s.data.garments.includes(garment))
  : []

export const getMeasurementSettingId = (state) => (setting) => setting.data.id
export const getMeasurementSettingName = (state) => (setting) => setting.data.name
export const getMeasurementSettingType = (state) => (setting) => setting.data.type
export const getMeasurementSettingGarments = (state) => (setting) => setting.data.garments
export const getMeasurementSettingMinValue = (state) => (setting) => setting.data.min_value
export const getMeasurementSettingMaxValue = (state) => (setting) => setting.data.max_value
