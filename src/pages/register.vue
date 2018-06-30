<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('register.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field
          :error="hasErrors('data.name', $v.form.data.name.$error)"
          :error-label="errorLabel('data.name')"
          class="q-mb-md"
        >
          <q-input
            autofocus
            :float-label="$t('register.companyName')"
            type="text"
            v-model="form.data.name"
          />
        </q-field>
        <template v-for="(user, i) in form.data.users">
          <q-field
            :key="'email' + i"
            :helper="$t('register.emailHelper')"
            :error="hasErrors(`data.users.${i}.data.email`, $v.form.data.users.$each[i].data.email.$error)"
            :error-label="errorLabel(`data.users.${i}.data.email`)"
            class="q-mb-md"
          >
            <q-input
              class="full-width"
              :float-label="$t('register.email')"
              type="email"
              v-model="user.data.email"
            />
          </q-field>
          <q-field
            :key="'password' + i"
            :helper="$t('register.passwordHelper', { passwordLength })"
            :error="hasErrors(`data.users.${i}.data.password`, $v.form.data.users.$each[i].data.password.$error)"
            :error-label="errorLabel(`data.users.${i}.data.password`)"
            class="q-mb-md"
          >
            <q-input
              class="full-width"
              :float-label="$t('register.password')"
              type="password"
              v-model="user.data.password"
            />
          </q-field>
        </template>
        <q-field v-if="!complete" class="q-mb-md">
          <q-btn class="full-width" color="primary" @click.prevent="submit" :label="$t('register.submitForm')" />
        </q-field>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
const MIN_PASSWORD_LENGTH = 8
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      complete: false,
      form: {
        data: {
          name: '',
          users: [
            {
              data: {
                email: '',
                password: ''
              }
            }
          ]
        }
      },
      errors: {
        'data.name': [],
        'data.users.0.data.email': [],
        'data.users.0.data.password': []
      }
    }
  },
  validations: {
    form: {
      data: {
        name: { required },
        users: {
          required,
          $each: {
            data: {
              email: { required, email },
              password: { required, minLength: minLength(MIN_PASSWORD_LENGTH) }
            }
          }
        }
      }
    }
  },
  computed: {
    passwordLength: () => MIN_PASSWORD_LENGTH
  },
  methods: {
    async submit () {
      this.resetErrors()
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }

      try {
        await this.$axios.post('/companies', this.form)
        this.complete = true
        this.$q.notify({
          message: this.$t('register.verifyEmail'),
          timeout: 0,
          type: 'positive'
        })
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
