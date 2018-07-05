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
            <q-td key="actions" slot="body-cell-actions" slot-scope="props">
              <q-btn @click.prevent="confirmDeleteMeasurementSetting(props.row)" flat dense color="negative" icon="delete" />
              <q-btn @click.prevent="editRow(props.row)" flat dense color="primary" icon="edit" />
            </q-td>
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
      measurementSettingToDelete: null,
      confirmedDelete: false,
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
          name: 'minValue',
          label: this.$t('measurementSettings.columns.minValue'),
          align: 'left',
          field: setting => setting.data.min_value,
          format: val => this.$unitOfMeasurement.valueToText(val, this.companyUnitOfMeasurement),
          visible: true
        },
        {
          name: 'maxValue',
          label: this.$t('measurementSettings.columns.maxValue'),
          align: 'left',
          field: setting => setting.data.max_value,
          format: val => this.$unitOfMeasurement.valueToText(val, this.companyUnitOfMeasurement),
          visible: true
        },
        {
          name: 'actions',
          label: this.$t('measurementSettings.columns.actions'),
          align: 'left',
          field: setting => setting.data.id,
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
  watch: {
    confirmedDelete (newValue, oldValue) {
      if (newValue) {
        this.deleteMeasurementSetting()
      }
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
    editRow (measurementSetting) {
      console.log(measurementSetting)
    },
    async confirmDeleteMeasurementSetting (measurementSetting) {
      this.confirmedDelete = false
      this.measurementSettingToDelete = measurementSetting
      try {
        await this.$q.dialog({
          message: this.$t('measurementSettings.delete.message', { measurementSetting: measurementSetting.data.name }),
          timeout: 0,
          ok: this.$t('measurementSettings.delete.confirm'),
          cancel: this.$t('measurementSettings.delete.cancel')
        })
        this.confirmedDelete = true
      } catch (error) {
        this.measurementSettingToDelete = null
        this.confirmedDelete = false
      }
    },
    async deleteMeasurementSetting () {
      try {
        await this.$axios.delete(`/companies/${this.companyId}/measurement-settings/${this.measurementSettingToDelete.data.id}`)

        // Remove from the settings instead of reloading them to save an AJAX request.
        this.settings = this.settings.filter(setting => setting.data.id !== this.measurementSettingToDelete.data.id)
      } catch (error) {
        this.$q.notify(this.$t('measurementSettings.delete.error'))
      } finally {
        this.measurementSettingToDelete = null
        this.confirmedDelete = false
      }
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
