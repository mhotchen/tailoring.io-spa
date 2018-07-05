export const UNIT_OF_MEASUREMENT_CENTIMETERS = 'CENTIMETERS'
export const UNIT_OF_MEASUREMENT_INCHES = 'INCHES'
export const UNIT_OF_MEASUREMENT_ALL = [UNIT_OF_MEASUREMENT_CENTIMETERS, UNIT_OF_MEASUREMENT_INCHES]

export function micrometersToUnitOfMeasurement (mm, unit) {
  switch (unit) {
    case UNIT_OF_MEASUREMENT_CENTIMETERS:
      return micrometersToCentimeters(mm)
    case UNIT_OF_MEASUREMENT_INCHES:
      return micrometersToInches(mm)
    default:
      throw Error(`Unknown unit of measurement: ${unit}`)
  }
}

const micrometersToCentimeters = mm => [Math.floor(mm / 10000), (Math.abs(mm / 10000) % 1).toFixed(3).slice(2)]
const micrometersToInches = mm => [Math.floor(mm / 25400), (Math.abs(mm / 25400) % 1).toFixed(3).slice(2)]
