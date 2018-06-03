<template v-if="userIsActive">
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('index.title', { company: userCompanyName }) }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <div class="col-md-6 q-pa-md">
            <q-card inline class="full-width">
              <q-card-title>
                {{ $t('index.customers.heading') }}
                <q-btn
                  @click="$router.push({ name: 'customer-new' })"
                  color="primary"
                  slot="right"
                  dense
                  round
                  icon="person_add"
                />
              </q-card-title>
              <q-card-separator />
              <q-card-main>
                <q-search
                  v-if="totalCustomers > 0"
                  :placeholder="$t('index.customers.search')"
                  class="q-mb-md"
                  :debounce="300"
                  v-model="search"
                />
                <p class="text-weight-thin float-right">
                  {{ $tc('index.customers.total', this.totalCustomers, { total: this.totalCustomers }) }}
                </p>
              </q-card-main>
              <div class="relative-position" style="min-height: 50px">
                <transition
                  appear
                  enter="fadeIn"
                  leave="fadeOut"
                >
                  <q-list no-border separator>
                    <q-list-header v-if="totalCustomers > 0">
                      <template v-if="search !== ''">
                        {{ $tc(
                          'index.customers.searchResults',
                          this.getLastInsertedCustomers.length,
                          { count: this.getLastInsertedCustomers.length }
                        ) }}
                      </template>
                      <template v-else>
                        {{ $tc(
                          'index.customers.recentlyUpdated',
                          this.getLastInsertedCustomers.length,
                          { count: this.getLastInsertedCustomers.length }
                        ) }}
                      </template>
                    </q-list-header>
                    <q-collapsible
                      v-if="getLastInsertedCustomers.length"
                      v-for="id in getLastInsertedCustomers"
                      :key="'customer-'+id"
                      :label="getCustomerName(id)"
                      group="customers"
                    >
                      <q-item v-if="getCustomerEmail(id)">
                        <q-item-side>
                          <a :href="`mailto:${getCustomerEmail(id)}`">
                            <q-btn round dense icon="mail" color="primary" />
                          </a>
                        </q-item-side>
                        <q-item-main>{{ getCustomerEmail(id) }}</q-item-main>
                      </q-item>
                      <q-item v-if="getCustomerTelephone(id)">
                        <q-item-side>
                          <a :href="`tel:${getCustomerTelephone(id)}`">
                            <q-btn round dense icon="phone" color="primary" />
                          </a>
                        </q-item-side>
                        <q-item-main>{{ getCustomerTelephone(id) }}</q-item-main>
                      </q-item>
                      <q-item>
                        <q-item-main>
                          <div class="row">
                            <div class="col-lg-6 q-pa-sm">
                              <q-btn
                                outline
                                color="primary"
                                class="full-width"
                                :label="$t('index.customers.view')"
                                @click.prevent="$router.push({ name: 'customer-view', params: { id } })"
                              />
                            </div>
                            <div class="col-lg-6 q-pa-sm">
                              <q-btn outline color="primary" class="full-width" :label="$t('index.customers.order')" />
                            </div>
                          </div>
                        </q-item-main>
                      </q-item>
                    </q-collapsible>
                  </q-list>
                </transition>
                <q-inner-loading :visible="loading">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
              </div>
            </q-card>
          </div>

          <div class="col-md-6 q-pa-md">
            <q-card inline class="full-width">
              <q-card-title>
                {{ $t('index.customers.heading') }}
              </q-card-title>
              <q-card-separator />
              <q-card-main>
                <q-search :placeholder="$t('index.customers.search')" :debounce="400" v-model="search" />
              </q-card-main>
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

export default {
  data () {
    return {
      totalCustomers: 0,
      search: '',
      loading: false
    }
  },
  created () {
    if (!this.userIsLoading && !this.userIsActive) {
      this.$router.replace({ name: 'login' })
    }

    if (this.userIsActive) {
      this.load()
    }
  },
  watch: {
    userIsActive (newValue, oldValue) {
      if (!newValue) {
        this.$router.replace({ name: 'login' })
      }

      this.load()
    },
    search (newValue, oldValue) {
      this.load()
    }
  },
  computed: {
    ...mapGetters('user', ['userIsActive', 'userIsLoading', 'userCompanyId', 'userCompanyName']),
    ...mapGetters('customers', [
      'getLastInsertedCustomers',
      'getCustomerName',
      'getCustomerEmail',
      'getCustomerTelephone'
    ])
  },
  methods: {
    ...mapActions('customers', ['loadCustomers']),
    async load () {
      this.loading = true
      let request = this.$axios.get(`/companies/${this.userCompanyId}/customers`, {
        params: {
          q: this.search
        }
      })
      await this.loadCustomers(request)
      this.totalCustomers = (await request).data.meta.total_customers
      this.loading = false
    }
  }
}
</script>
