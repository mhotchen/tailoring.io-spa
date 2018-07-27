import { micrometersToUnitOfMeasurement } from './unitOfMeasurementType'

export const MEASUREMENT_TYPE_BODY = 'BODY'
export const MEASUREMENT_TYPE_GARMENT = 'GARMENT'
export const MEASUREMENT_TYPE_SAMPLE_ADJUSTMENT = 'SAMPLE_ADJUSTMENT'
export const MEASUREMENT_TYPE_ALTERATION = 'ALTERATION'
export const MEASUREMENT_TYPE_ALL = [
  MEASUREMENT_TYPE_BODY,
  MEASUREMENT_TYPE_GARMENT,
  MEASUREMENT_TYPE_SAMPLE_ADJUSTMENT,
  MEASUREMENT_TYPE_ALTERATION
]

const CENTIMETER_TO_MICROMETER = 10000

/**
 * Body measurements can be associated with multiple types of garments (eg. the bicep circumference is useful in
 * both jackets and shirts). All other measurement types must be associated with exactly one garment (eg. the waist
 * on a pair of trousers is considered a separate measurement to the waist on a shirt which may have different
 * tolerances).
 *
 * @param {string} measurementType One of the constants in this file
 * @returns {boolean}
 */
export function canMeasurementTypeHaveMultipleGarments (measurementType) {
  switch (measurementType) {
    case MEASUREMENT_TYPE_BODY:
      return true
    default:
      return false
  }
}

/**
 * Get the minimum allowed value for the value range option in the measurement settings rounded to the nearest
 * whole unit of measurement (ie. to the nearest inch or centimeter).
 *
 * Some measurement types allow for negative values as the minimum value (alteration/adjustment measurements).
 *
 * @param {string} measurementType   One of the constants in this file
 * @param {string} unitOfMeasurement The preferred unit of measurement
 * @returns {number}
 */
export function getMeasurementTypeMinimumValueInUnitOfMeasurement (measurementType, unitOfMeasurement) {
  switch (measurementType) {
    case MEASUREMENT_TYPE_SAMPLE_ADJUSTMENT:
    case MEASUREMENT_TYPE_ALTERATION:
      return micrometersToUnitOfMeasurement(-15 * CENTIMETER_TO_MICROMETER, unitOfMeasurement)[0]
    default:
      // 0
      return 0
  }
}

/**
 * Get the maximum allowed value for the value range option in the measurement settings rounded to the nearest
 * whole unit of measurement (ie. to the nearest inch or centimeter).
 *
 * @param {string} measurementType   One of the constants in this file
 * @param {string} unitOfMeasurement The preferred unit of measurement
 * @returns {number}
 */
export function getMeasurementTypeMaximumValueInUnitOfMeasurement (measurementType, unitOfMeasurement) {
  switch (measurementType) {
    case MEASUREMENT_TYPE_SAMPLE_ADJUSTMENT:
    case MEASUREMENT_TYPE_ALTERATION:
      return micrometersToUnitOfMeasurement(15 * CENTIMETER_TO_MICROMETER, unitOfMeasurement)[0]
    case MEASUREMENT_TYPE_BODY:
      return micrometersToUnitOfMeasurement(280 * CENTIMETER_TO_MICROMETER, unitOfMeasurement)[0]
    case MEASUREMENT_TYPE_GARMENT:
    default:
      return micrometersToUnitOfMeasurement(200 * CENTIMETER_TO_MICROMETER, unitOfMeasurement)[0]
  }
}
