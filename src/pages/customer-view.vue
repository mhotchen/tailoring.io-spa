<template v-if="userIsActive">
  <q-page>
    <q-card flat v-if="loaded">
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
          <q-card
            inline
            class="col-md-auto q-mr-md q-mb-md"
            style="min-width: 300px"
            v-if="getCustomerEmail || getCustomerTelephone"
          >
            <q-card-title>
              {{ $t('customer.view.contact.heading', { name: getCustomerName }) }}
            </q-card-title>
            <q-card-separator />
            <q-list>
              <q-item v-if="getCustomerEmail">
                <q-item-side icon="email" />
                <q-item-main>{{ getCustomerEmail }}</q-item-main>
              </q-item>
              <q-item v-if="getCustomerTelephone">
                <q-item-side icon="phone" />
                <q-item-main>{{ getCustomerTelephone }}</q-item-main>
              </q-item>
            </q-list>
          </q-card>
          <q-card inline class="col-md-auto q-mr-md q-mb-md" style="min-width: 300px" v-if="hasCustomerNotes">
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
          <q-card inline class="col-md-auto q-mr-md q-mb-md relative-position" style="min-width: 300px">
            <q-card-title>
              {{ $t('customer.view.orders.heading') }}
            </q-card-title>
            <q-card-separator />
            <q-list v-if="false">
            </q-list>
            <q-card-main v-else style="padding-bottom: 70px">
              {{ $t('customer.view.orders.none') }}
            </q-card-main>
            <q-card-actions vertical class="absolute-bottom">
              <q-btn
                @click="$router.push({ name: 'customer-new' })"
                icon="add"
                class="full-width"
                align="left"
                color="primary"
                :label="$t('customer.view.orders.new')"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import customer from '../store/customer'

export default {
  data () {
    return {
      id: this.$route.params.id,
      loaded: false
    }
  },
  beforeCreate () {
    // https://github.com/vuejs/vuex/issues/833
    if (!(`customer-${this.$route.params.id}` in this.$store._modules.root._children)) {
      this.$store.registerModule(`customer-${this.$route.params.id}`, customer)
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
    userIsLoading (newValue, oldValue) {
      if (!newValue && !this.userIsActive) {
        this.$router.replace({ name: 'login' })
        return
      }

      this.load()
    }
  },
  computed: {
    ...mapGetters('accessToken', ['isAccessTokenSet']),
    ...mapGetters('user', ['userIsActive', 'userIsLoading', 'userCompanyId']),

    // mapGetters, mapActions, etc. don't work with dynamic modules
    getCustomerName () { return this.$store.getters[`customer-${this.id}/getCustomerName`] },
    getCustomerEmail () { return this.$store.getters[`customer-${this.id}/getCustomerEmail`] },
    getCustomerTelephone () { return this.$store.getters[`customer-${this.id}/getCustomerTelephone`] },
    getCustomerNotes () { return this.$store.getters[`customer-${this.id}/getCustomerNotes`] },
    hasCustomerNotes () { return this.$store.getters[`customer-${this.id}/hasCustomerNotes`] }
  },
  methods: {
    getCustomerNoteCreatedAt (note) {
      return this.$store.getters[`customer-${this.id}/getCustomerNoteCreatedAt`](note)
    },
    getCustomerNoteValue (note) {
      return this.$store.getters[`customer-${this.id}/getCustomerNoteValue`](note)
    },
    async load () {
      try {
        await this.$store.dispatch(
          `customer-${this.id}/loadCustomer`,
          this.$axios.get(`/companies/${this.userCompanyId}/customers/${this.id}`)
        )
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
      this.loaded = true
    }
  }
}
</script>
