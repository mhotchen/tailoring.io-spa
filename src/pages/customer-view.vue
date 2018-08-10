<template>
  <q-page>
    <q-card flat v-if="getCustomerName">
      <q-card-title>
        {{ getCustomerName }}
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-btn
          @click="$router.push({ name: 'customer-edit', params: { id: id } })"
          color="primary"
          :label="$t('customer.view.edit')"
          icon="person"
          class="q-mb-md"
        />
        <div class="row">
          <!-- Contact info -->
          <div v-if="getCustomerEmail || getCustomerTelephone" class="col-lg-4 q-pr-md q-pb-md">
            <q-card>
              <q-card-title>
                {{ $t('customer.view.contact.heading', { name: getCustomerName }) }}
              </q-card-title>
              <q-card-separator />
              <q-list>
                <q-item v-if="getCustomerEmail">
                  <q-item-side>
                    <a :href="`mailto:${getCustomerEmail}`">
                      <q-btn round dense icon="mail" color="primary" />
                    </a>
                  </q-item-side>
                  <q-item-main>{{ getCustomerEmail }}</q-item-main>
                </q-item>
                <q-item v-if="getCustomerTelephone">
                  <q-item-side>
                    <a :href="`tel:${getCustomerTelephone}`">
                      <q-btn round dense icon="phone" color="primary" />
                    </a>
                  </q-item-side>
                  <q-item-main>{{ getCustomerTelephone }}</q-item-main>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Notes -->
          <div v-if="hasCustomerNotes" class="col-lg-4 q-pr-md q-pb-md">
            <q-card>
              <q-card-title>
                {{ $t('customer.view.notes.heading') }}
              </q-card-title>
              <q-card-separator />
              <q-list>
                <q-item separator v-for="(note, i) in getCustomerNotes" :key="'note'+i">
                  <q-item-side>{{ getCustomerNoteCreatedAt(note).toLocaleDateString() }}</q-item-side>
                  <q-item-main>{{ getCustomerNoteValue(note) }}</q-item-main>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Orders -->
          <div class="col-lg-4 q-pr-md q-pb-md">
            <q-card>
              <q-card-title>
                {{ $t('customer.view.orders.heading') }}
              </q-card-title>
              <q-card-separator />
              <q-card-main>
                <q-btn
                  @click="$router.push({ name: 'customer-new' })"
                  outline
                  icon="add"
                  color="primary"
                  :label="$t('customer.view.orders.new')"
                />
              </q-card-main>
              <q-card-separator />
              <q-list v-if="false">
              </q-list>
              <q-card-main v-else>
                {{ $t('customer.view.orders.none') }}
              </q-card-main>
            </q-card>
          </div>

          <!-- Measurements -->
          <div class="col-lg-4 q-pr-md q-pb-md">
            <q-card>
              <q-card-title>
                {{ $t('customer.view.measurements.heading') }}
              </q-card-title>
              <q-card-separator />
              <q-list>
                <!-- Body measurements -->
                <q-list-header label>
                  {{ $t('types.measurementProfileType.BODY.short') }}
                </q-list-header>
                <q-item>
                  <q-item-main>
                    <q-item-tile v-if="measurementProfileHasCommits(getCustomerBodyMeasurementProfile)">
                      <q-btn
                        @click="$router.push({
                          name: 'edit-measurement-profile',
                          params: { customer: id, id: getMeasurementProfileId(getCustomerBodyMeasurementProfile) },
                        })"
                        color="primary"
                        :label="$t('customer.view.measurements.edit')"
                      />
                      <q-btn
                        @click="$router.push({
                          name: 'view-measurement-profile',
                          params: { customer: id, id: getMeasurementProfileId(getCustomerBodyMeasurementProfile) },
                        })"
                        flat
                        no-caps
                        color="primary"
                        :label="$t('customer.view.measurements.view')"
                      />
                    </q-item-tile>
                    <q-item-tile v-else>
                      {{ $t('customer.view.measurements.noMeasurements') }}
                      <q-btn
                        @click="$router.push({
                          name: 'edit-measurement-profile',
                          params: { customer: id, id: getMeasurementProfileId(getCustomerBodyMeasurementProfile) },
                        })"
                        icon="add"
                        color="primary"
                        :label="$t('customer.view.measurements.addNew')"
                      />
                    </q-item-tile>
                  </q-item-main>
                </q-item>

                <!-- Garment specific measurements -->
                <template v-for="garment in garments">
                  <q-list-header label :key="garment + 'title'">
                    {{ $t(`types.garmentType.${garment}.short`)}}
                  </q-list-header>
                  <q-item-main :key="garment + 'main'">
                    <template v-if="getCustomerMeasurementProfilesByGarment(garment).length > 0">
                      <q-item-tile
                        :key="getMeasurementProfileId(profile)"
                        v-for="profile in getCustomerMeasurementProfilesByGarment(garment)"
                      >
                        {{ profile.data.name }}
                        <q-btn
                          @click="$router.push({
                          name: 'edit-measurement-profile',
                          params: { customer: id, id: getMeasurementProfileId(profile) },
                        })"
                          color="primary"
                          :label="$t('customer.view.measurements.edit')"
                        />
                        <q-btn
                          @click="$router.push({
                          name: 'view-measurement-profile',
                          params: { customer: id, id: getMeasurementProfileId(profile) },
                        })"
                          flat
                          no-caps
                          color="primary"
                          :label="$t('customer.view.measurements.view')"
                        />
                      </q-item-tile>
                    </template>
                    <q-item-tile v-else>
                      {{ $t('customer.view.measurements.noMeasurements') }}
                      <q-btn
                        @click="$router.push({
                          name: 'new-measurement-profile',
                          params: { customer: id, garment },
                        })"
                        icon="add"
                        color="primary"
                        :label="$t('customer.view.measurements.addNew')"
                      />
                    </q-item-tile>
                  </q-item-main>
                </template>
              </q-list>
            </q-card>
          </div>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GARMENT_TYPE_ALL } from '../types/garmentType'

export default {
  data () {
    return {
      id: this.$route.params.id
    }
  },
  created () {
    this.load()
  },
  watch: {
    '$route' (newValue, oldValue) {
      this.id = newValue.params.id
      this.load()
    }
  },
  computed: {
    ...mapGetters('company', ['companyId']),
    ...mapGetters('customer', [
      'getCustomerName',
      'getCustomerEmail',
      'getCustomerTelephone',
      'getCustomerNotes',
      'hasCustomerNotes',
      'getCustomerNoteCreatedAt',
      'getCustomerNoteValue',
      'getCustomerBodyMeasurementProfile',
      'getCustomerMeasurementProfilesByGarment',
      'getMeasurementProfileId',
      'getMeasurementProfileType',
      'measurementProfileHasCommits'
    ]),
    garments () {
      return GARMENT_TYPE_ALL
    }
  },
  methods: {
    ...mapActions('customer', ['hydrateFromCustomers', 'loadCustomer']),
    async load () {
      this.hydrateFromCustomers(this.id)
      try {
        await this.loadCustomer(this.$axios.get(`/companies/${this.companyId}/customers/${this.id}`))
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
