<template>
  <q-page>
    <q-card flat v-if="getCustomerName && commit.data">
      <q-card-title>
        {{ $t(
          `types.measurementProfileType.${getMeasurementProfileType(getProfile)}.title`,
          { garment: getMeasurementProfileGarment, customer: getCustomerName }
        ) }}
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field
          v-if="!isBodyProfile"
          class="q-mb-md row"
          :label="$t('measurementProfile.edit.form.name.label')"
          :helper="$t('measurementProfile.edit.form.name.helper')"
        >
          Foo
        </q-field>

        <!-- Measurements -->
        <q-field
          class="q-mb-md row"
          v-for="setting in getRelevantSettings"
          :key="getMeasurementSettingId(setting)"
          :label="getMeasurementSettingName(setting)"
          orientation="vertical"
        >
          <div class="row no-wrap">
            <app-measurement-select
              class="col-sm-3"
              v-model="getMeasurementBySetting(setting.data.id).data.value"
              :min="getMeasurementSettingMinValue(setting)"
              :max="getMeasurementSettingMaxValue(setting)"
              :unit-of-measurement="companyUnitOfMeasurement"
              show-subunits
            />
            <q-field
              class="q-ml-md col-md-6"
              :label-width="3"
              label="Comment:"
              size="sm"
            >
              <q-input
                maxlength="50"
                v-model="getMeasurementBySetting(setting.data.id).data.comment"
              />
            </q-field>
          </div>
        </q-field>

        <q-field
          class="row q-mb-md"
          v-if="measurementProfileHasCommits(getProfile)"
          :label="$t('measurementProfile.edit.form.commitMessage.label')"
          :helper="$t('measurementProfile.edit.form.commitMessage.helper')"
          orientation="vertical"
        >
          <div class="row no-wrap">
            <q-input
              class="col-sm-3"
              maxlength="50"
              v-model="commit.data.message"
            />
          </div>
        </q-field>

        <q-field
          class="q-mt-lg"
        >
          <q-btn
            @click="saveCommit"
            :label="$t('measurementProfile.edit.form.save.label')"
            class="full-width"
            color="primary"
          />
        </q-field>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { uid, extend } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import AppMeasurementSelect from '../components/AppMeasurementSelect'
import { isMeasurementProfileTypeBody } from '../types/measurementProfileType'

export default {
  components: {
    'app-measurement-select': AppMeasurementSelect
  },
  data () {
    return {
      customerId: this.$route.params.customer,
      id: this.$route.params.id || null,
      type: this.$route.query.type || null,
      garment: this.$route.query.garment || null,
      commit: {}
    }
  },
  created () {
    this.load()
  },
  watch: {
    '$route' (newValue, oldValue) {
      this.customerId = newValue.params.customer
      this.load()
    }
  },
  computed: {
    ...mapGetters('company', ['companyId', 'companyUnitOfMeasurement']),
    ...mapGetters('customer', [
      'getCustomerId',
      'getCustomerName',
      'getCustomerMeasurementProfile',
      'getMeasurementProfileGarment',
      'getMeasurementProfileType',
      'getCurrentMeasurementValue',
      'getCurrentMeasurementComment',
      'measurementProfileHasCommits'
    ]),
    ...mapGetters('measurementSettings', [
      'getMeasurementSettings',
      'getMeasurementSettingsByType',
      'getMeasurementSettingId',
      'getMeasurementSettingName',
      'getMeasurementSettingMinValue',
      'getMeasurementSettingMaxValue'
    ]),
    getProfile () {
      return this.getCustomerMeasurementProfile(this.id)
    },
    isBodyProfile () {
      return isMeasurementProfileTypeBody(this.getMeasurementProfileType(this.getProfile))
    },
    getRelevantSettings () {
      if (this.isBodyProfile) {
        return this.getMeasurementSettingsByType(this.getMeasurementProfileType(this.getProfile))
      } else {
        // TODO: get by type and garment
      }
    },
    getCommitForSaving () {
      let commit = extend(true, {}, this.commit)

      // This will have to change to be based on previous values, etc.
      commit.data.measurements = commit.data.measurements.filter(measurement =>
        measurement.data.value !== null || measurement.data.comment !== null
      )

      return commit
    }
  },
  methods: {
    ...mapActions('customer', ['hydrateFromCustomers', 'loadCustomer']),
    ...mapActions('measurementSettings', ['loadMeasurementSettings']),
    async load () {
      this.hydrateFromCustomers(this.customerId)
      if (this.getCustomer) {
        this.initializeCommit()
      }

      try {
        await Promise.all([
          this.loadCustomer(this.$axios.get(`/companies/${this.companyId}/customers/${this.customerId}`)),
          this.loadMeasurementSettings(this.$axios.get(`/companies/${this.companyId}/measurement-settings`))
        ])
        this.initializeCommit()
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
    initializeCommit () {
      this.commit = {
        data: {
          id: uid(),
          profile_id: this.id,
          name: this.isBodyProfile ? this.$t('measurementProfile.edit.form.name.default') : null,
          message: null,
          sample_garment: null,
          measurements: this.getRelevantSettings.map(setting => {
            return {
              data: {
                id: uid(),
                setting_id: this.getMeasurementSettingId(setting),
                value: this.getCurrentMeasurementValue(this.id, this.getMeasurementSettingId(setting)),
                comment: this.getCurrentMeasurementComment(this.id, this.getMeasurementSettingId(setting))
              }
            }
          })
        }
      }
    },
    getMeasurementBySetting (id) {
      return this.commit.data.measurements.reduce((l, r) => l.data.setting_id === id ? l : r)
    },
    async saveCommit () {
      // If previous commits exists filter out measurements on new commit that match the old commits' value and comment
      // If new commit's measurements are empty and the name and sample garment are the same as the previous commit do nothing
      try {
        await this.$axios.post(
          `/companies/${this.companyId}/customers/${this.getCustomerId}/measurement-profiles/${this.id}/commits`,
          this.getCommitForSaving
        )
        this.$router.push({ name: 'customer-view', params: { id: this.customerId } })
      } catch (error) {
        if (!error.hasOwnProperty('response')) {
          throw error
        }

        switch (error.response.status) {
          case 422:
            this.errors = { ...this.errors, ...error.response.data.errors }
            break
          default:
            throw error
        }
      }
    }
  }
}
</script>
