<template>
  <div id="q-app">
    <router-view />
    <q-ajax-bar position="top" size="5px" :delay="50" color="secondary" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  created () {
    this.loadAccessTokenFromStorage()
  },
  computed: {
    ...mapGetters('accessToken', ['isAccessTokenSet', 'accessToken']),
    ...mapGetters('user', ['userIsLoading', 'userIsLoaded'])
  },
  watch: {
    async isAccessTokenSet (newValue, oldValue) {
      if (!newValue) {
        this.logout()
        return
      }

      this.$axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

      /*
       * The login/email verification/password reset endpoints return the user themselves so check if the user is
       * already logged in to save a HTTP request.
       */

      if (!this.userIsLoaded) {
        try {
          await this.loadUser(this.$axios.get('/users/me'))
        } catch (error) {
          // The stored token is probably invalid so clear state/log user out.
          this.setAccessToken(null)
        }
      }
    }
  },
  methods: {
    ...mapActions('accessToken', ['loadAccessTokenFromStorage', 'clearAccessTokenFromStorage']),
    ...mapMutations('accessToken', ['setAccessToken']),
    ...mapActions('user', ['loadUser']),
    ...mapMutations('user', ['unsetUser']),
    logout () {
      this.$axios.defaults.headers.common['Authorization'] = null
      this.unsetUser()
      this.clearAccessTokenFromStorage()
    }
  }
}
</script>

<style>
</style>
