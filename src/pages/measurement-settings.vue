<template v-if="userIsActive">
  <q-page>
    <q-card flat>
      <q-card-title>
        TODO
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <!--
            Use visible-columns instead of only defining the visible columns because the 'id' column is the only
            one that's guaranteed to be unique which is a required property of the row-key parameter.
          -->
          <q-table
            :data="settings"
            :columns="columns"
            :visible-columns="['name', 'type', 'garments']"
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
import { mapGetters } from 'vuex'
import { GARMENT_TYPE_ALL } from '../types/garmentType'

export default {
  data () {
    return {
      columns: [
        {
          name: 'id',
          label: '',
          field: setting => setting.data.id
        },
        {
          name: 'name',
          label: this.$t('measurementSettings.columns.name'),
          align: 'left',
          field: setting => setting.data.name
        },
        {
          name: 'type',
          label: this.$t('measurementSettings.columns.type'),
          align: 'left',
          field: setting => setting.data.type,
          format: val => this.$t(`types.measurementType.${val}.short`)
        },
        {
          name: 'garments',
          label: this.$t('measurementSettings.columns.garments'),
          align: 'left',
          field: setting => setting.data.garment_types,
          format: val => val.reduce((str, val) => `${str}, ` + this.$t(`types.garmentType.${val}.short`), '').slice(2)
        }
      ],
      settings: [],
      filterGarmentType: '',
      garmentTypes: [
        { label: this.$t('measurementSettings.garmentTypeFilter.all'), value: '' },
        ...GARMENT_TYPE_ALL.map((type) => {
          return { label: this.$t(`types.garmentType.${type}.short`), value: type }
        })
      ]
    }
  },
  created () {
    if (!this.userIsLoading && !this.userIsActive) {
      this.$router.replace({ name: 'login' })
      return
    }

    if (this.userIsActive) {
      this.load()
    }
  },
  watch: {
    userIsActive (newValue, oldValue) {
      if (!newValue) {
        this.$router.replace({ name: 'login' })
        return
      }

      this.load()
    },
    '$route' (newValue, oldValue) {
      this.id = newValue.params.id
      this.load()
    }
  },
  computed: {
    ...mapGetters('accessToken', ['isAccessTokenSet']),
    ...mapGetters('user', ['userIsActive', 'userIsLoading', 'userCompanyId'])
  },
  methods: {
    filterGarments (rows, terms, cols, cellValue) {
      return rows.filter((row) => terms === '' || row.data.garment_types.includes(terms))
    },
    async load () {
      try {
        this.settings = (await this.$axios.get(`/companies/${this.userCompanyId}/measurement-settings`)).data.data
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
