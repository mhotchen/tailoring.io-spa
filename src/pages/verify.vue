<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('verify.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <form @submit.prevent="submit">
          <q-alert class="q-mb-md" color="negative" icon="error" v-if="hasErrors('data.verification_code')">
            {{ $t('verify.invalidIdInUrl') }}
          </q-alert>
          <q-field
            :error="hasErrors('data.password', $v.form.data.password.$error)"
            :error-label="errorLabel('data.password')"
            class="q-mb-md"
          >
            <q-input
              autofocus
              class="full-width"
              :float-label="$t('verify.password')"
              type="password"
              v-model="form.data.password"
            />
          </q-field>
          <q-field class="q-mb-md">
            <q-toggle class="full-width" :label="$t('verify.rememberMe')" v-model="rememberMe" />
          </q-field>
          <q-field v-if="!complete" class="q-mb-md">
            <q-btn class="full-width" color="primary" :label="$t('verify.submitForm')" />
          </q-field>
        </form>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      complete: false,
      rememberMe: false,
      form: {
        data: {
          verification_code: this.$route.params.code,
          password: ''
        }
      },
      errors: {
        'data.verification_code': [],
        'data.password': []
      }
    }
  },
  validations: {
    form: {
      data: {
        verification_code: { required },
        password: { required }
      }
    }
  },
  computed: mapGetters('user', ['userIsLoading', 'userIsLoggedIn']),
  created () {
    if (this.userIsLoading || this.userIsLoggedIn) {
      this.$router.replace({ name: 'index' })
    }
  },
  watch: {
    userIsLoggedIn (newValue, oldValue) {
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
        this.$q.notify(this.$t('verify.invalidInput'))
        return
      }

      try {
        let request = this.$axios.post('/users/verifications', this.form)
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
