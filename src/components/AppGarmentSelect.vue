<template>
  <q-select
    @change="change"
    :value="value"
    :multiple="multiple"
    :options="garmentTypes"
  />
</template>

<script>
import { GARMENT_TYPE_ALL } from '../types/garmentType'
export default {
  props: {
    value: {},
    multiple: Boolean,
    allowClear: Boolean
  },
  computed: {
    garmentTypes () {
      let garmentTypes = GARMENT_TYPE_ALL.map(type => {
        return { label: this.$t(`types.garmentType.${type}.short`), value: type }
      })
      if (this.allowClear) {
        garmentTypes.unshift({ label: this.$t('measurementSettings.garmentTypeFilter.all'), value: '' })
      }

      return garmentTypes
    }
  },
  methods: {
    change (value) {
      this.$emit('input', value)
    }
  }
}
</script>
