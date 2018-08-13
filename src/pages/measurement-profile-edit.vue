<template>
  <q-page>
    <q-card flat v-if="getCustomerName && commit.data && profile.data">
      <q-card-title>
        {{ $t(
          `types.measurementProfileType.${getMeasurementProfileType(profile)}.title`,
          {
            garment: $t(`types.garmentType.${getMeasurementProfileGarment(profile)}.short`),
            customer: getCustomerName
          }
        ) }}
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field
          v-if="!isBodyProfile"
          class="q-mb-md row"
          :label="$t('measurementProfile.edit.form.name.label')"
          :helper="$t('measurementProfile.edit.form.name.helper')"
          orientation="vertical"
        >
          <div class="row no-wrap">
            <q-input
              class="col-sm-3"
              maxlength="50"
              v-model="commit.data.name"
            />
          </div>
        </q-field>

        <!-- Sample garment -->
        <q-field
          v-if="!isBodyProfile"
          class="q-mb-md row"
          :label="$t('measurementProfile.edit.form.sampleGarment.label')"
          orientation="vertical"
        >
          <div class="row no-wrap">
            <q-select
              class="col-sm-3"
              maxlength="50"
              :options="getSampleOptions"
              v-model="commit.data.sample_garment"
            />
          </div>
        </q-field>

        <!-- Measurements -->
        <q-field
          class="q-mb-md row"
          v-for="setting in getDisplayedSettings"
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
          v-if="measurementProfileHasCommits(profile)"
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
            @click="save"
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
import { uid } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import AppMeasurementSelect from '../components/AppMeasurementSelect'
import {
  isMeasurementProfileTypeBody,
  MEASUREMENT_PROFILE_TYPE_GARMENT
} from '../types/measurementProfileType'
import {
  MEASUREMENT_TYPE_ALTERATION,
  MEASUREMENT_TYPE_BODY,
  MEASUREMENT_TYPE_SAMPLE_ADJUSTMENT
} from '../types/measurementType'

export default {
  components: {
    'app-measurement-select': AppMeasurementSelect
  },
  data () {
    return {
      customerId: this.$route.params.customer,
      id: this.$route.params.id || null,
      profile: null,
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
      'getCurrentProfileName',
      'getCurrentProfileSampleGarmentId',
      'measurementProfileHasCommits'
    ]),
    ...mapGetters('measurementSettings', [
      'getMeasurementSettings',
      'getMeasurementSettingsByType',
      'getMeasurementSettingsByGarment',
      'getMeasurementSettingId',
      'getMeasurementSettingName',
      'getMeasurementSettingMinValue',
      'getMeasurementSettingMaxValue'
    ]),
    ...mapGetters('sampleGarments', ['getSampleGarmentsByGarment', 'getSampleGarmentId', 'getSampleGarmentName']),
    isBodyProfile () {
      return isMeasurementProfileTypeBody(this.getMeasurementProfileType(this.profile))
    },
    getRelevantSettings () {
      if (this.isBodyProfile) {
        return this.getMeasurementSettingsByType(MEASUREMENT_TYPE_BODY)
      } else {
        return this
          .getMeasurementSettingsByGarment(this.getMeasurementProfileGarment(this.profile))
          .filter(m => m.data.type !== MEASUREMENT_TYPE_BODY)
      }
    },
    getDisplayedSettings () {
      // Body profiles don't have any hidden settings at any point
      if (this.isBodyProfile) {
        return this.getRelevantSettings
      }

      let filtered = []

      // Only show sample adjustment measurements when a sample garment has been selected
      if (this.commit.data === undefined || this.commit.data.sample_garment === null) {
        filtered.push(MEASUREMENT_TYPE_SAMPLE_ADJUSTMENT)
      }

      // Only show alteration measurements when editing an existing profile
      if (!this.id) {
        filtered.push(MEASUREMENT_TYPE_ALTERATION)
      }

      return this
        .getRelevantSettings
        .filter(m => !filtered.includes(m.data.type))
    },
    getSampleOptions () {
      return [
        { value: null, label: 'None' },
        ...this.getSampleGarmentsByGarment(this.profile.data.garment).map(sampleGarment => {
          return {value: this.getSampleGarmentId(sampleGarment), label: this.getSampleGarmentName(sampleGarment)}
        })
      ]
    }
  },
  methods: {
    ...mapActions('customer', ['hydrateFromCustomers', 'loadCustomer']),
    ...mapActions('measurementSettings', ['loadMeasurementSettings']),
    ...mapActions('sampleGarments', ['loadSampleGarments']),
    async load () {
      this.hydrateFromCustomers(this.customerId)
      if (this.getCustomer && this.getRelevantSettings) {
        this.initializeProfile()
        this.initializeCommit()
      }

      try {
        await Promise.all([
          this.loadCustomer(this.$axios.get(`/companies/${this.companyId}/customers/${this.customerId}`)),
          this.loadMeasurementSettings(this.$axios.get(`/companies/${this.companyId}/measurement-settings`)),
          this.loadSampleGarments(this.$axios.get(`/companies/${this.companyId}/sample-garments`))
        ])
        this.initializeProfile()
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
          name: this.getCurrentProfileName(this.id) || this.$t('measurementProfile.edit.form.name.default'),
          message: null,
          sample_garment: this.getCurrentProfileSampleGarmentId(this.id) || null,
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
    initializeProfile () {
      if (this.id) {
        this.profile = this.getCustomerMeasurementProfile(this.id)
      } else {
        this.profile = {
          data: {
            id: uid(),
            type: MEASUREMENT_PROFILE_TYPE_GARMENT,
            garment: this.$route.params.garment,
            commits: []
          }
        }
      }
    },
    getMeasurementBySetting (id) {
      return this.commit.data.measurements.length
        ? this.commit.data.measurements.reduce((l, r) => l.data.setting_id === id ? l : r)
        : null
    },
    async save () {
      try {
        if (!this.id) {
          this.id =
            (await this.$axios.post(
              `/companies/${this.companyId}/customers/${this.getCustomerId}/measurement-profiles`,
              this.profile
            )).data.data.id
        }
        // The server will detect whether the commit changes anything or not so the commit may not actually be saved
        // if the values remain unchanged (in which case a 202 Accepted response is returned indicating that the
        // request was valid, but not saved. It should be trivial to also do this on the client in the future,
        // however, MVP and all that :)
        await this.$axios.post(
          `/companies/${this.companyId}/customers/${this.getCustomerId}/measurement-profiles/${this.id}/commits`,
          this.commit
        )
        this.$router.push({ name: 'customer-view', params: { id: this.customerId } })
      } catch (error) {
        if (!error.hasOwnProperty('response')) {
          throw error
        }

        switch (error.response.status) {
          default:
            throw error
        }
      }
    }
  }
}
</script>
