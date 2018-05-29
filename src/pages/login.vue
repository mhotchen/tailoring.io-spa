<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('login.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <form @submit.prevent="submit">
          <q-field
            :error="hasErrors('data.email', $v.form.data.email.$error)"
            :error-label="errorLabel('data.email')"
            class="q-mb-md"
          >
            <q-input
              autofocus
              class="full-width"
              :float-label="$t('login.email')"
              type="email"
              v-model="form.data.email"
            />
          </q-field>
          <q-field
            class="q-mb-md"
            :error="hasErrors('data.password', $v.form.data.password.$error)"
            :error-label="errorLabel('data.password')"
          >
            <q-input
              class="full-width"
              :float-label="$t('login.password')"
              type="password"
              v-model="form.data.password"
            />
          </q-field>
          <q-field class="q-mb-md">
            <q-toggle class="full-width" :label="$t('login.rememberMe')" v-model="rememberMe" />
          </q-field>
          <q-field v-if="!complete" class="q-mb-md">
            <q-btn class="full-width" color="primary" :label="$t('login.submitForm')" />
          </q-field>
        </form>
        <q-field class="q-mb-md">
          <i18n class="q-subheading" tag="p" path="login.createAccount.noAccount">
            <router-link class="text-no-wrap" place="startTrialLink" :to="{ name: 'register' }">
              {{ $t('login.createAccount.createAccount') }}<!-- Comment to strip extra whitespace in the link.
            --></router-link>
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
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      complete: false,
      rememberMe: false,
      form: {
        data: {
          email: '',
          password: ''
        }
      },
      errors: {
        'data.email': [],
        'data.password': []
      }
    }
  },
  validations: {
    form: {
      data: {
        email: { required, email },
        password: { required }
      }
    }
  },
  computed: mapGetters('user', ['userIsLoading', 'userIsLoaded']),
  created () {
    if (this.userIsLoading || this.userIsLoaded) {
      this.$router.replace({ name: 'index' })
    }
  },
  watch: {
    userIsLoaded (newValue, oldValue) {
      if (newValue) {
        this.$router.replace({ name: 'index' })
      }
    }
  },
  methods: {
    ...mapActions('user', ['loadUser']),
    ...mapActions('accessToken', ['storeAccessTokenInStorage']),
    ...mapMutations('accessToken', ['setAccessToken']),
    async submit () {
      this.resetErrors()
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify(this.$t('login.invalidInput'))
        return
      }

      try {
        let request = this.$axios.post('/users/login-attempts', this.form)
        await this.loadUser(request)
        this.setAccessToken((await request).data.meta.jwt.access_token)
        this.storeAccessTokenInStorage(this.rememberMe)
      } catch (error) {
        switch (error.response.status) {
          case 422:
            this.errors = {...this.errors, ...error.response.data.errors}
            break
          default:
            throw error
        }
      }
    },
    // I tried plugins and shit for this but the vue documentation is crap and I couldn't figure out how to access
    // 'this' whatever 'this' is...
    // So... feel free to copy and paste these methods all over the code.
    hasErrors: function (key, vuelidateError) {
      return this.errors[key].length > 0 || vuelidateError
    },
    errorLabel: function (key) {
      return this.errors[key].reduce((message, error) => message + '\n' + this.$t(error), '')
    },
    resetErrors: function () {
      for (let v in this.errors) {
        this.errors[v] = []
      }
    }
  }
}
</script>
