<template>
  <q-page>
    <q-card flat>
      <q-card-title>
        {{ $t('sampleGarments.title') }}
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <q-table
            :data="garments"
            :columns="columns"
            :visible-columns="columns.filter(col => col.visible === true).map(col => col.name)"
            row-key="id"
            :filter="filterGarmentType"
            :filter-method="filterGarments"
            class="col-xs-12"
          >
            <div slot="top" slot-scope="props" class="col-xs-12">
              <h3 class="q-headline">{{ $t('sampleGarments.table.title') }}</h3>
              <p>{{ $t('sampleGarments.table.subtitle') }}</p>
              <q-field
                orientation="vertical"
                class="float-right"
                :label="$t('sampleGarments.garmentTypeFilter.label')"
              >
                <q-select
                  color="secondary"
                  v-model="filterGarmentType"
                  :options="filterGarmentTypes"
                />
              </q-field>
              <q-btn
                class="q-mt-md"
                v-if="sampleGarmentToCreate === null"
                @click.prevent="beginCreatingSampleGarment"
                icon="playlist_add"
                :label="$t('sampleGarments.create.label')"
                no-caps
                flat
                dense
                color="primary"
              />
            </div>

            <!-- CREATE A NEW SAMPLE GARMENT ROW -->

            <q-tr v-if="sampleGarmentToCreate !== null" slot="top-row" slot-scope="props">
              <q-td name="name">
                <q-field
                  :error="hasErrors('data.name', $v.sampleGarmentToCreate.data.name.$error)"
                  :error-label="errorLabel('data.name')"
                >
                  <q-input
                    v-model="sampleGarmentToCreate.data.name"
                    maxlength="50"
                  />
                </q-field>
              </q-td>
              <q-td name="garment">
                <q-field
                  :error="hasErrors('data.garment', $v.sampleGarmentToCreate.data.garment.$error)"
                  :error-label="errorLabel('data.garment')"
                >
                  <q-select
                    v-model="sampleGarmentToCreate.data.garment"
                    :options="garmentTypes"
                  />
                </q-field>
              </q-td>
              <q-td name="actions">
                <q-btn @click.prevent="cancelCreatingSampleGarment" icon="cancel" flat dense color="negative" />
                <q-btn @click.prevent="saveCreatingSampleGarment" icon="done" flat dense color="primary" />
              </q-td>
            </q-tr>

            <!-- THE "name" CELL WHICH IS EDITABLE -->

            <q-td key="name" slot="body-cell-name" slot-scope="props">
              <template v-if="sampleGarmentToEdit && sampleGarmentToEdit.data.id === props.row.data.id">
                <q-input
                  v-model="sampleGarmentToEdit.data.name"
                  @change.prevent="saveEditingSampleGarment"
                  maxlength="50"
                  :after="[
                    { icon: 'done', content: true, handler: saveEditingSampleGarment },
                    { icon: 'cancel', handler: cancelEditingSampleGarment }
                  ]"
                />
              </template>
              <template v-else>
                {{ props.row.data.name }}
              </template>
            </q-td>
            <q-td key="actions" slot="body-cell-actions" slot-scope="props">
              <q-btn @click.prevent="confirmDeleteSampleGarment(props.row)" flat dense color="negative" icon="delete" />
              <q-btn @click.prevent="beginEditingSampleGarment(props.row)" flat dense color="primary" icon="edit" />
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
import { extend, uid } from 'quasar'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { GARMENT_TYPE_ALL } from '../types/garmentType'

export default {
  data () {
    return {
      sampleGarmentToDelete: null,
      sampleGarmentToEdit: null,
      sampleGarmentToCreate: null,
      confirmedDelete: false,
      filterGarmentType: '',
      garmentTypes: GARMENT_TYPE_ALL.map((type) => {
        return { label: this.$t(`types.garmentType.${type}.short`), value: type }
      }),
      columns: [
        {
          name: 'id',
          label: '',
          field: setting => setting.data.id,
          visible: false
        },
        {
          name: 'name',
          label: this.$t('sampleGarments.columns.name'),
          align: 'left',
          field: setting => setting.data.name,
          visible: true
        },
        {
          name: 'garment',
          label: this.$t('sampleGarments.columns.garment'),
          align: 'left',
          field: setting => setting.data.garment,
          format: val => this.$t(`types.garmentType.${val}.short`),
          visible: true
        },
        {
          name: 'actions',
          label: this.$t('sampleGarments.columns.actions'),
          align: 'left',
          field: setting => setting.data.id,
          visible: true
        }
      ],
      garments: [],
      errors: {
        'data.name': [],
        'data.garment': []
      }
    }
  },
  validations () {
    return {
      sampleGarmentToCreate: {
        data: {
          name: { required, maxLength: maxLength(50) },
          garment: { required }
        }
      }
    }
  },
  watch: {
    confirmedDelete (newValue, oldValue) {
      if (newValue) {
        this.deleteSampleGarment()
      }
    }
  },
  created () {
    this.load()
  },
  computed: {
    ...mapGetters('company', ['companyId']),
    filterGarmentTypes () {
      return [
        { label: this.$t('sampleGarments.garmentTypeFilter.all'), value: '' },
        ...this.garmentTypes
      ]
    }
  },
  methods: {
    filterGarments (rows, terms, cols, cellValue) {
      return rows.filter((row) => terms === '' || row.data.garment === terms)
    },
    async load () {
      try {
        this.garments = (await this.$axios.get(`/companies/${this.companyId}/sample-garments`)).data.data
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

    // CREATING A SAMPLE GARMENT.

    beginCreatingSampleGarment () {
      this.sampleGarmentToCreate = {
        data: {
          id: uid(),
          name: '',
          garment: null
        }
      }
    },
    cancelCreatingSampleGarment () {
      this.sampleGarmentToCreate = null
      this.resetErrors()
      this.$v.sampleGarmentToCreate.$reset()
    },
    async saveCreatingSampleGarment () {
      this.resetErrors()
      this.$v.sampleGarmentToCreate.$touch()
      if (this.$v.sampleGarmentToCreate.$error) {
        return
      }

      try {
        this.garments.unshift(
          (await this.$axios.post(`/companies/${this.companyId}/sample-garments`, this.sampleGarmentToCreate))
            .data
        )
        this.cancelCreatingSampleGarment()
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

    // EDITING A SAMPLE GARMENT.

    beginEditingSampleGarment (sampleGarment) {
      this.sampleGarmentToEdit = extend(true, {}, sampleGarment)
    },
    cancelEditingSampleGarment () {
      this.sampleGarmentToEdit = null
    },
    async saveEditingSampleGarment () {
      try {
        await this.$axios.put(
          `/companies/${this.companyId}/sample-garments/${this.sampleGarmentToEdit.data.id}`,
          this.sampleGarmentToEdit
        )

        // Update in place to save an AJAX request
        this.garments = this.garments.map(setting =>
          setting.data.id === this.sampleGarmentToEdit.data.id ? this.sampleGarmentToEdit : setting
        )
      } catch (error) {
        this.$q.notify(this.$t('sampleGarments.edit.error'))
      } finally {
        this.sampleGarmentToEdit = null
      }
    },

    // DELETING A SAMPLE GARMENT.

    async confirmDeleteSampleGarment (sampleGarment) {
      this.confirmedDelete = false
      this.sampleGarmentToDelete = sampleGarment
      try {
        await this.$q.dialog({
          title: this.$t('sampleGarments.delete.title', { sampleGarment: sampleGarment.data.name }),
          message: this.$t('sampleGarments.delete.message', { sampleGarment: sampleGarment.data.name }),
          timeout: 0,
          ok: this.$t('sampleGarments.delete.confirm'),
          cancel: this.$t('sampleGarments.delete.cancel')
        })
        this.confirmedDelete = true
      } catch (error) {
        this.sampleGarmentToDelete = null
        this.confirmedDelete = false
      }
    },
    async deleteSampleGarment () {
      try {
        await this.$axios.delete(`/companies/${this.companyId}/sample-garments/${this.sampleGarmentToDelete.data.id}`)

        // Remove from the garments instead of reloading them to save an AJAX request.
        this.garments = this.garments.filter(setting => setting.data.id !== this.sampleGarmentToDelete.data.id)
      } catch (error) {
        this.$q.notify(this.$t('sampleGarments.delete.error'))
      } finally {
        this.sampleGarmentToDelete = null
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
