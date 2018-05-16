<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('login.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field>
          <q-input class="full-width" :float-label="$t('login.email')" type="email" v-model="form.email" />
        </q-field>
        <q-field class="q-mt-md">
          <q-input class="full-width" :float-label="$t('login.password')" type="password" v-model="form.password" />
        </q-field>
        <q-field class="q-mt-md">
          <q-toggle class="full-width" :label="$t('login.rememberMe')" v-model="form.rememberMe" />
        </q-field>
        <q-field class="q-mt-md">
          <q-btn class="full-width" color="primary" :label="$t('login.submitForm')" @click="submit" />
        </q-field>
        <q-field class="q-mt-md">
          <i18n class="q-subheading" tag="p" path="login.createAccount.noAccount">
            <router-link class="text-no-wrap" place="startTrialLink" :to="{ name: 'register' }">{{ $t('login.createAccount.createAccount') }}</router-link>
          </i18n>
        </q-field>
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
