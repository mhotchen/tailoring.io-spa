import { micrometersToUnitOfMeasurement } from '../types/unitOfMeasurementType'

const cache = {
  items: {}, // Because of sparse indexing using an object is faster.
  unitOfMeasurement: null
}

export default ({ app, router, Vue }) => {
  Vue.prototype.$unitOfMeasurement = {
    valueToText (value, unitOfMeasurement) {
      // If user switched unit of measurement then flush cache
      if (cache.unitOfMeasurement !== unitOfMeasurement) {
        cache.items = {}
        cache.unitOfMeasurement = unitOfMeasurement
      }

      if (cache.items[value] === undefined) {
        let converted = micrometersToUnitOfMeasurement(value, unitOfMeasurement)
        let subunit =
          app.i18n.te(`types.unitOfMeasurementType.${unitOfMeasurement}.subunits.${converted[1]}`)
            ? app.i18n.t(`types.unitOfMeasurementType.${unitOfMeasurement}.subunits.${converted[1]}`)
            : `.${converted[1]}`

        cache.items[value] = app.i18n.t(`types.unitOfMeasurementType.${unitOfMeasurement}.abbr`, {
          num: converted[0].toString() + subunit
        })
      }

      return cache.items[value]
    }
  }
}
