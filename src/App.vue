<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  created () {
    let user = null

    if (this.$q.cookies.has('user')) {
      user = this.$q.cookies.get('user')
    } else if (this.$q.sessionStorage.has('user')) {
      user = this.$q.sessionStorage.get.item('user')
    }

    if (!this.$store.getters['user/isLoggedIn'] && user) {
      this.$store.commit('user/set', user)
    }
  }
}
</script>

<style>
</style>
