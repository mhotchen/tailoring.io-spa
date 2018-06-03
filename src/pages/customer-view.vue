<template v-if="userIsActive">
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
      id: this.$route.params.id
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
    ...mapGetters('user', ['userIsActive', 'userIsLoading', 'userCompanyId']),
    ...mapGetters('customer', [
      'getCustomerName',
      'getCustomerEmail',
      'getCustomerTelephone',
      'getCustomerNotes',
      'hasCustomerNotes',
      'getCustomerNoteCreatedAt',
      'getCustomerNoteValue'
    ])
  },
  methods: {
    ...mapActions('customer', ['hydrateFromCustomers', 'loadCustomer']),
    async load () {
      this.hydrateFromCustomers(this.id)
      try {
        await this.loadCustomer(this.$axios.get(`/companies/${this.userCompanyId}/customers/${this.id}`))
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
