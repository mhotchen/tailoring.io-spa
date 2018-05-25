<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('index.title', { company: companyName() }) }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <p>Test</p>
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
    if (!this.isLoggedIn()) {
      this.$router.replace({ name: 'login' })
    }
  },
  methods: {
    ...mapGetters('user', ['isLoggedIn', 'get', 'companyName'])
  }
}
</script>
