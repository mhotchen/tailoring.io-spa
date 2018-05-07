<template>
  <q-page>
    <q-card>
      <q-card-title>{{ $t('login.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <q-input class="full-width" :float-label="$t('login.email')" type="email" v-model="form.email" />
        </div>
        <div class="row q-mt-md">
          <q-input class="full-width" :float-label="$t('login.password')" type="password" v-model="form.password" />
        </div>
        <div class="row q-mt-md">
          <q-toggle class="full-width" :label="$t('login.rememberMe')" v-model="form.rememberMe" />
        </div>
        <div class="row q-mt-md">
          <q-btn class="full-width" color="primary" :label="$t('login.submitForm')" @click="submit" />
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'PageIndex',
  data () {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      }
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify(this.$t('login.invalidInput'))
        return
      }

      this.$axios
        .post('/oauth/token', {
          grant_type: 'password',
          client_id: process.env.OAUTH_CLIENT_ID,
          client_secret: process.env.OAUTH_CLIENT_SECRET,
          username: this.form.email,
          password: this.form.password,
          scope: ''
        })
        .then((response) => {
          console.log(response)
        })
    }
  }
}
</script>
