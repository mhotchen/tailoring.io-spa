export const UNIT_OF_MEASUREMENT_CENTIMETERS = 'CENTIMETERS'
export const UNIT_OF_MEASUREMENT_INCHES = 'INCHES'
export const UNIT_OF_MEASUREMENT_ALL = [UNIT_OF_MEASUREMENT_CENTIMETERS, UNIT_OF_MEASUREMENT_INCHES]

const MICROMETERS_IN_CENTIMETER = 10000
const MICROMETERS_IN_INCH = 25400

/**
 * @param {number} mm   The micrometers
 * @param {string} unit One of the constants in this file
 * @returns {number[]}  First value is the whole unit, second value is the subunit (after decimal place)
 */
export function micrometersToUnitOfMeasurement (mm, unit) {
  switch (unit) {
    case UNIT_OF_MEASUREMENT_CENTIMETERS:
      return [
        Math.floor(mm / MICROMETERS_IN_CENTIMETER),
        (Math.abs(mm / MICROMETERS_IN_CENTIMETER) % 1).toFixed(3).slice(2)
      ]
    case UNIT_OF_MEASUREMENT_INCHES:
      return [
        Math.floor(mm / MICROMETERS_IN_INCH),
        (Math.abs(mm / MICROMETERS_IN_INCH) % 1).toFixed(3).slice(2)
      ]
    default:
      throw Error(`Unknown unit of measurement: ${unit}`)
  }
}

/**
 * @param {number[]} measurement The first value being the whole unit and second value being subunit
 *                               (after decimal place)
 * @param {string}   unit        One of the constants in this file
 * @returns {number}
 */
export function unitOfMeasurementToMicrometers (measurement, unit) {
  switch (unit) {
    case UNIT_OF_MEASUREMENT_CENTIMETERS:
      return (measurement[0] * MICROMETERS_IN_CENTIMETER) +
        (measurement[1] === 0 ? 0 : (MICROMETERS_IN_CENTIMETER * measurement[1] / 1000))
    case UNIT_OF_MEASUREMENT_INCHES:
      return (measurement[0] * MICROMETERS_IN_INCH) +
        (measurement[1] === 0 ? 0 : (MICROMETERS_IN_INCH * measurement[1] / 1000))
    default:
      throw Error(`Unknown unit of measurement: ${unit}`)
  }
}

/**
 * Get a list of incrementing micrometers for the division of the subunit in to its subunits.
 * For example we divide inches in to eighths, so the list will return 7 items starting at one eighth of an inch in
 * micrometers, a quarter, three eighths, ... until seven eighths.
 *
 * @param {string} unit One of the constants in this file
 * @returns {number[]}  A list with incremental subunits in micrometers
 */
export function subunitListInMicrometers (unit) {
  let createList = (wholeUnit, divisionCount) => {
    let units = []
    let subunits = wholeUnit / divisionCount
    for (let i = subunits; i < wholeUnit; i += subunits) {
      units.push(i)
    }

    return units
  }

  switch (unit) {
    case UNIT_OF_MEASUREMENT_CENTIMETERS:
      return createList(MICROMETERS_IN_CENTIMETER, 4)
    case UNIT_OF_MEASUREMENT_INCHES:
      return createList(MICROMETERS_IN_INCH, 8)
    default:
      throw Error(`Unknown unit of measurement: ${unit}`)
  }
}
