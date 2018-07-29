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
            class="col-xs-12"
          >
            <div slot="top" slot-scope="props" class="col-xs-12">
              <h3 class="q-headline">{{ $t('measurementSettings.table.title') }}</h3>
              <p>{{ $t('measurementSettings.table.subtitle') }}</p>
              <q-field
                orientation="vertical"
                class="float-right"
                :label="$t('measurementSettings.garmentTypeFilter.label')"
              >
                <q-select
                  color="secondary"
                  v-model="filterGarmentType"
                  :options="filterGarmentTypes"
                />
              </q-field>
              <q-btn
                class="q-mt-md"
                v-if="measurementSettingToCreate === null"
                @click.prevent="beginCreatingMeasurementSetting"
                icon="playlist_add"
                :label="$t('measurementSettings.create.label')"
                no-caps
                flat
                dense
                color="primary"
              />
            </div>

            <!-- CREATE A NEW MEASUREMENT SETTING ROW -->

            <q-tr v-if="measurementSettingToCreate !== null" slot="top-row" slot-scope="props">
              <q-td name="name">
                <q-field
                  :error="hasErrors('data.name', $v.measurementSettingToCreate.data.name.$error)"
                  :error-label="errorLabel('data.name')"
                >
                  <q-input
                    v-model="measurementSettingToCreate.data.name"
                    maxlength="20"
                  />
                </q-field>
              </q-td>
              <q-td name="type">
                <q-field
                  :error="hasErrors('data.type', $v.measurementSettingToCreate.data.type.$error)"
                  :error-label="errorLabel('data.type')"
                >
                  <q-select
                    v-model="measurementSettingToCreate.data.type"
                    :options="types"
                  />
                </q-field>
              </q-td>
              <q-td name="garments">
                <q-field
                  :error="hasErrors('data.garments', $v.measurementSettingToCreate.data.garments.$error)"
                  :error-label="errorLabel('data.garments')"
                >
                  <q-select
                    v-if="createMeasurementTypeCanHaveMultipleGarments"
                    v-model="measurementSettingToCreate.data.garments"
                    multiple
                    :options="garmentTypes"
                  />
                  <!-- below is a computed property to convert to an array -->
                  <q-select
                    v-else
                    v-model="measurementSettingToCreateSingleGarment"
                    radio
                    :options="garmentTypes"
                  />
                </q-field>
              </q-td>
              <q-td name="min_value">
                <q-field
                  :error="hasErrors('data.min_value', $v.measurementSettingToCreate.data.min_value.$error)"
                  :error-label="errorLabel('data.min_value')"
                >
                  <app-measurement-select
                    v-model="measurementSettingToCreate.data.min_value"
                    :min="measurementSettingToCreateMinimumValue"
                    :max="measurementSettingToCreateMaximumValue"
                    :unit-of-measurement="companyUnitOfMeasurement"
                  />
                </q-field>
              </q-td>
              <q-td name="max_value">
                <q-field
                  :error="hasErrors('data.max_value', $v.measurementSettingToCreate.data.max_value.$error)"
                  :error-label="errorLabel('data.max_value')"
                >
                  <app-measurement-select
                    v-model="measurementSettingToCreate.data.max_value"
                    :min="measurementSettingToCreateMinimumValue"
                    :max="measurementSettingToCreateMaximumValue"
                    :unit-of-measurement="companyUnitOfMeasurement"
                  />
                </q-field>
              </q-td>
              <q-td name="actions">
                <q-btn @click.prevent="cancelCreatingMeasurementSetting" icon="cancel" flat dense color="negative" />
                <q-btn @click.prevent="saveCreatingMeasurementSetting" icon="done" flat dense color="primary" />
              </q-td>
            </q-tr>

            <!-- THE "name" CELL WHICH IS EDITABLE -->

            <q-td key="name" slot="body-cell-name" slot-scope="props">
              <template v-if="measurementSettingToEdit && measurementSettingToEdit.data.id === props.row.data.id">
                <q-input
                  v-model="measurementSettingToEdit.data.name"
                  @change.prevent="saveEditingMeasurementSetting"
                  maxlength="50"
                  :after="[
                    { icon: 'done', content: true, handler: saveEditingMeasurementSetting },
                    { icon: 'cancel', handler: cancelEditingMeasurementSetting }
                  ]"
                />
              </template>
              <template v-else>
                {{ props.row.data.name }}
              </template>
            </q-td>
            <q-td key="actions" slot="body-cell-actions" slot-scope="props">
              <q-btn @click.prevent="confirmDeleteMeasurementSetting(props.row)" flat dense color="negative" icon="delete" />
              <q-btn @click.prevent="beginEditingMeasurementSetting(props.row)" flat dense color="primary" icon="edit" />
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
import { required, maxLength } from 'vuelidate/lib/validators'
import { extend, uid } from 'quasar'
import AppMeasurementSelect from '../components/AppMeasurementSelect'
import { GARMENT_TYPE_ALL } from '../types/garmentType'
import {
  MEASUREMENT_TYPE_ALL,
  canMeasurementTypeHaveMultipleGarments,
  getMeasurementTypeMinimumValueInUnitOfMeasurement,
  getMeasurementTypeMaximumValueInUnitOfMeasurement
} from '../types/measurementType'
import { UNIT_OF_MEASUREMENT_ALL } from '../types/unitOfMeasurementType'

export default {
  components: {
    'app-measurement-select': AppMeasurementSelect
  },
  data () {
    return {
      errorSavingUnitOfMeasurement: false,
      measurementSettingToDelete: null,
      measurementSettingToEdit: null,
      measurementSettingToCreate: null,
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
          field: setting => setting.data.garments,
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
      types: [
        ...MEASUREMENT_TYPE_ALL.map((type) => {
          return {
            label: this.$t(`types.measurementType.${type}.short`),
            sublabel: this.$t(`types.measurementType.${type}.description`),
            sublabelLines: 5,
            value: type
          }
        })
      ],
      filterGarmentType: '',
      garmentTypes: GARMENT_TYPE_ALL.map((type) => {
        return { label: this.$t(`types.garmentType.${type}.short`), value: type }
      }),
      unitOfMeasurementTypes: UNIT_OF_MEASUREMENT_ALL.map((type) => {
        return { label: this.$tc(`types.unitOfMeasurementType.${type}.short`), value: type }
      }),
      errors: {
        'data.name': [],
        'data.type': [],
        'data.garments': [],
        'data.min_value': [],
        'data.max_value': []
      }
    }
  },
  validations () {
    return {
      measurementSettingToCreate: {
        data: {
          name: { required, maxLength: maxLength(20) },
          type: { required },
          garments: { required },
          min_value: { required },
          max_value: {
            required,
            greaterThanMinValue (value) {
              return this.measurementSettingToCreate.data.min_value < value
            }
          }
        }
      }
    }
  },
  watch: {
    confirmedDelete (newValue, oldValue) {
      if (newValue) {
        this.deleteMeasurementSetting()
      }
    },
    'measurementSettingToCreate.data.type': function (newValue, oldValue) {
      if (this.measurementSettingToCreate === null) {
        return
      }

      if (!canMeasurementTypeHaveMultipleGarments(newValue) && this.measurementSettingToCreate.data.garments.length > 1) {
        this.measurementSettingToCreate.data.garments.splice(1)
      }
    }
  },
  created () {
    this.load()
  },
  computed: {
    ...mapGetters('company', ['company', 'companyId', 'companyUnitOfMeasurement']),
    filterGarmentTypes () {
      return [
        { label: this.$t('measurementSettings.garmentTypeFilter.all'), value: '' },
        ...this.garmentTypes
      ]
    },
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
    },

    // COMPUTED PROPERTIES FOR CREATING A NEW MEASUREMENT SETTING.

    createMeasurementTypeCanHaveMultipleGarments () {
      return canMeasurementTypeHaveMultipleGarments(this.measurementSettingToCreate.data.type)
    },
    measurementSettingToCreateSingleGarment: {
      get () {
        return this.measurementSettingToCreate.data.garments[0]
      },
      set (newValue) {
        this.measurementSettingToCreate.data.garments = [newValue]
      }
    },
    measurementSettingToCreateMinimumValue () {
      return getMeasurementTypeMinimumValueInUnitOfMeasurement(
        this.measurementSettingToCreate.data.type,
        this.companyUnitOfMeasurement
      )
    },
    measurementSettingToCreateMaximumValue () {
      return getMeasurementTypeMaximumValueInUnitOfMeasurement(
        this.measurementSettingToCreate.data.type,
        this.companyUnitOfMeasurement
      )
    }
  },
  methods: {
    ...mapActions('company', ['loadCompany']),
    ...mapMutations('company', ['setCompanyUnitOfMeasurement']),
    filterGarments (rows, terms, cols, cellValue) {
      return rows.filter((row) => terms === '' || row.data.garments.includes(terms))
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
    },

    // CREATING A MEASUREMENT SETTING.

    beginCreatingMeasurementSetting () {
      this.measurementSettingToCreate = {
        data: {
          id: uid(),
          name: '',
          type: null,
          garments: [],
          min_value: 0,
          max_value: 0
        }
      }
    },
    cancelCreatingMeasurementSetting () {
      this.measurementSettingToCreate = null
      this.resetErrors()
      this.$v.measurementSettingToCreate.$reset()
    },
    async saveCreatingMeasurementSetting () {
      this.resetErrors()
      this.$v.measurementSettingToCreate.$touch()
      if (this.$v.measurementSettingToCreate.$error) {
        return
      }

      try {
        this.settings.unshift(
          (await this.$axios.post(`/companies/${this.companyId}/measurement-settings`, this.measurementSettingToCreate))
            .data
        )
        this.cancelCreatingMeasurementSetting()
      } catch (error) {
        switch (error.response.status) {
          case 422:
            this.errors = {...this.errors, ...error.response.data.errors}
            break
          default:
            throw error
        }
      }
    },

    // EDITING A MEASUREMENT SETTING.

    beginEditingMeasurementSetting (measurementSetting) {
      this.measurementSettingToEdit = extend(true, {}, measurementSetting)
    },
    cancelEditingMeasurementSetting () {
      this.measurementSettingToEdit = null
    },
    async saveEditingMeasurementSetting () {
      try {
        await this.$axios.put(
          `/companies/${this.companyId}/measurement-settings/${this.measurementSettingToEdit.data.id}`,
          this.measurementSettingToEdit
        )

        // Update in place to save an AJAX request
        this.settings = this.settings.map(setting =>
          setting.data.id === this.measurementSettingToEdit.data.id ? this.measurementSettingToEdit : setting
        )
      } catch (error) {
        this.$q.notify(this.$t('measurementSettings.edit.error'))
      } finally {
        this.measurementSettingToEdit = null
      }
    },

    // DELETING A MEASUREMENT SETTING.

    async confirmDeleteMeasurementSetting (measurementSetting) {
      this.confirmedDelete = false
      this.measurementSettingToDelete = measurementSetting
      try {
        await this.$q.dialog({
          title: this.$t('measurementSettings.delete.title', { measurementSetting: measurementSetting.data.name }),
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

    // I tried plugins and shit for this but the vue documentation is crap and I couldn't figure out how to access
    // 'this' whatever 'this' is...
    // So... feel free to copy and paste these methods all over the code.
    hasErrors: function (key, vuelidateError) {
      return this.errors[key].length > 0 || vuelidateError
    },
    errorLabel: function (key) {
      return this.errors[key].reduce(
        (message, error) =>
          message +
          '\n' +
          this.$t(this.$te(error) ? error : 'fields.generic.invalid'),
        ''
      )
    },
    resetErrors: function () {
      for (let v in this.errors) {
        this.errors[v] = []
      }
    }
  }
}
</script>
