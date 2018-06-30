<template>
  <q-page>
    <q-card flat>
      <q-card-title>
        {{ $t('measurementSettings.title') }}
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <q-field
            :error="errorSavingUnitOfMeasurement"
            :error-label="$t('measurementSettings.unitOfMeasurement.errorSaving')"
            :label="$t('measurementSettings.unitOfMeasurement.label')"
            class="q-mb-md"
            orientation="vertical"
          >
            <q-btn-toggle
              v-model="unitOfMeasurement"
              :options="unitOfMeasurementTypes"
            />
          </q-field>
        </div>
        <div class="row">
          <q-table
            :data="settings"
            :columns="columns"
            :visible-columns="columns.filter(col => col.visible === true).map(col => col.name)"
            row-key="id"
            :filter="filterGarmentType"
            :filter-method="filterGarments"
            :pagination="{ rowsPerPage: 0 }"
            :hide-bottom="true"
            class="col-xs-12"
          >
            <template slot="top-right" slot-scope="props">
              <q-field orientation="vertical" :label="$t('measurementSettings.garmentTypeFilter.label')">
                <q-select
                  color="secondary"
                  v-model="filterGarmentType"
                  :options="garmentTypes"
                />
              </q-field>
            </template>
          </q-table>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { GARMENT_TYPE_ALL } from '../types/garmentType'
import { UNIT_OF_MEASUREMENT_ALL } from '../types/unitOfMeasurementType'

export default {
  data () {
    return {
      errorSavingUnitOfMeasurement: false,
      columns: [
        {
          name: 'id',
          label: '',
          field: setting => setting.data.id,
          visible: false
        },
        {
          name: 'name',
          label: this.$t('measurementSettings.columns.name'),
          align: 'left',
          field: setting => setting.data.name,
          visible: true
        },
        {
          name: 'type',
          label: this.$t('measurementSettings.columns.type'),
          align: 'left',
          field: setting => setting.data.type,
          format: val => this.$t(`types.measurementType.${val}.short`),
          visible: true
        },
        {
          name: 'garments',
          label: this.$t('measurementSettings.columns.garments'),
          align: 'left',
          field: setting => setting.data.garment_types,
          format: val => val.reduce((str, val) => `${str}, ` + this.$t(`types.garmentType.${val}.short`), '').slice(2),
          visible: true
        },
        {
          name: 'range',
          label: this.$t('measurementSettings.columns.range'),
          align: 'left',
          field: setting => [setting.data.min_value, setting.data.max_value],
          format: val => val.reduce((str, val) => `${str}, ${val}`, '').slice(2),
          visible: true
        }
      ],
      settings: [],
      filterGarmentType: '',
      garmentTypes: [
        { label: this.$t('measurementSettings.garmentTypeFilter.all'), value: '' },
        ...GARMENT_TYPE_ALL.map((type) => {
          return { label: this.$t(`types.garmentType.${type}.short`), value: type }
        })
      ],
      unitOfMeasurementTypes: UNIT_OF_MEASUREMENT_ALL.map((type) => {
        return { label: this.$t(`types.unitOfMeasurementType.${type}.short`), value: type }
      })
    }
  },
  created () {
    this.load()
  },
  computed: {
    ...mapGetters('company', ['company', 'companyId', 'companyUnitOfMeasurement']),
    unitOfMeasurement: {
      get () {
        return this.companyUnitOfMeasurement
      },
      async set (newValue) {
        this.errorSavingUnitOfMeasurement = false
        let oldValue = this.unitOfMeasurement
        this.setCompanyUnitOfMeasurement(newValue)
        try {
          await this.loadCompany(this.$axios.put(`/companies/${this.companyId}`, this.company))
        } catch (error) {
          this.errorSavingUnitOfMeasurement = true
          this.setCompanyUnitOfMeasurement(oldValue)
          return
        }

        // Get measurement settings again now that the unit has been converted because it will be rounded to a new
        // value that makes sense in the changed unit of measurement.
        this.load()
      }
    }
  },
  methods: {
    ...mapActions('company', ['loadCompany']),
    ...mapMutations('company', ['setCompanyUnitOfMeasurement']),
    filterGarments (rows, terms, cols, cellValue) {
      return rows.filter((row) => terms === '' || row.data.garment_types.includes(terms))
    },
    async load () {
      try {
        this.settings = (await this.$axios.get(`/companies/${this.companyId}/measurement-settings`)).data.data
      } catch (error) {
        if (!('response' in error)) {
          throw error
        }

        switch (error.response.status) {
          case 403:
          case 404:
            this.$router.replace({ name: '404' })
            break
          default:
            throw error
        }
      }
    }
  }
}
</script>
