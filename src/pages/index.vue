<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('index.title', { company: userCompanyName }) }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row" v-if="userIsActive">
          <q-card inline class="col-md-auto q-mr-md q-mb-md">
            <q-card-title>
              {{ $t('index.customers.heading') }}
              <q-btn
                @click="$router.push({ name: 'customer-new' })"
                color="primary"
                slot="right"
                round
                icon="person_add"
              />
            </q-card-title>
            <q-card-separator />
            <q-card-main>
              <q-search :placeholder="$t('index.customers.search')" :debounce="400" v-model="search" />
            </q-card-main>
          </q-card>

          <q-card inline class="col-md-auto q-mr-md q-mb-md">
            <q-card-title>
              {{ $t('index.customers.heading') }}
              <q-btn color="primary" slot="right" round icon="person_add" />
            </q-card-title>
            <q-card-separator />
            <q-card-main>
              <q-search :placeholder="$t('index.customers.search')" :debounce="400" v-model="search" />
            </q-card-main>
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

export default {
  created () {
    if (!this.userIsLoading && !this.userIsLoggedIn) {
      this.$router.replace({ name: 'login' })
    }
  },
  watch: {
    userIsLoading (oldValue, newValue) {
      if (!newValue && !this.userIsLoggedIn) {
        this.$router.replace({ name: 'login' })
      }
    }
  },
  data () {
    return {
      search: ''
    }
  },
  computed: mapGetters('user', ['userIsLoggedIn', 'userIsLoading', 'userIsActive', 'userCompanyName'])
}
</script>
