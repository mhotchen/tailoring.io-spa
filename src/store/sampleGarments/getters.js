export const getSampleGarments = (state) => state.loaded ? state.garments : []
export const getSampleGarmentsByGarment = (state) => (garment) => state.loaded
  ? state.garments.filter(sampleGarment => sampleGarment.data.garment === garment)
  : []
export const getSampleGarmentId = (state) => (garment) => garment.data.id
export const getSampleGarmentName = (state) => (garment) => garment.data.name
