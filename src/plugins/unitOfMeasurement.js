import { micrometersToUnitOfMeasurement } from '../types/unitOfMeasurementType'

export default ({ app, router, Vue }) => {
  Vue.prototype.$unitOfMeasurement = {
    valueToText (value, unitOfMeasurement) {
      let converted = micrometersToUnitOfMeasurement(value, unitOfMeasurement)
      let subunit =
        app.i18n.te(`types.unitOfMeasurementType.${unitOfMeasurement}.subunits.${converted[1]}`)
          ? app.i18n.t(`types.unitOfMeasurementType.${unitOfMeasurement}.subunits.${converted[1]}`)
          : `.${converted[1]}`

      return app.i18n.t(`types.unitOfMeasurementType.${unitOfMeasurement}.abbr`, {
        num: converted[0].toString() + subunit
      })
    }
  }
}
