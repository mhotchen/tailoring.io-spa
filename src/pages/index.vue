<template>
  <q-page>
    <q-card>
      <q-card-title>{{ $t('login.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <q-input class="full-width" :float-label="$t('login.email')" ype="email" v-model="email" />
        </div>
        <div class="row q-mt-md">
          <q-input class="full-width" :float-label="$t('login.password')" type="password" v-model="password" />
        </div>
        <div class="row q-mt-md">
          <q-toggle class="full-width" :label="$t('login.rememberMe')" v-model="rememberMe" />
        </div>
        <div class="row q-mt-md">
          <q-btn class="full-width" color="primary" :label="$t('login.submitForm')" />
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      email: '',
      password: '',
      rememberMe: false
    }
  }
}
</script>
