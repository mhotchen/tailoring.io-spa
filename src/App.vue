<template>
  <div id="q-app">
    <router-view />
    <q-ajax-bar position="top" size="5px" :delay="50" color="secondary" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  created () {
    this.$q.addressbarColor.set()
  },
  computed: {
    ...mapGetters('accessToken', ['isAccessTokenSet', 'accessToken'])
  },
  watch: {
    async isAccessTokenSet (newValue, oldValue) {
      if (newValue) {
        this.$axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
      }
    }
  }
}
</script>

<style>
</style>
