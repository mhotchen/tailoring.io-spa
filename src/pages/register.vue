<template>
  <q-page>
    <q-card flat>
      <q-card-title>{{ $t('register.formTitle') }}</q-card-title>
      <q-card-separator />
      <q-card-main>
        <form @submit.prevent="submit">
          <q-field
            :error="hasErrors('data.name', $v.form.data.name.$error)"
            :error-label="errorLabel('data.name')"
          >
            <q-input
              :float-label="$t('register.companyName')"
              type="text"
              v-model="form.data.name"
            />
          </q-field>
          <template v-for="(user, i) in form.data.users">
            <q-field
              class="q-mt-md"
              :key="'email' + i"
              :helper="$t('register.emailHelper')"
              :error="hasErrors(`data.users.${i}.data.email`, $v.form.data.users.$each[i].data.email.$error)"
              :error-label="errorLabel(`data.users.${i}.data.email`)"
            >
              <q-input
                class="full-width"
                :float-label="$t('register.email')"
                type="email"
                v-model="user.data.email"
              />
            </q-field>
            <q-field
              class="q-mt-md"
              :key="'password' + i"
              :helper="$t('register.passwordHelper', { passwordLength })"
              :error="hasErrors(`data.users.${i}.data.password`, $v.form.data.users.$each[i].data.password.$error)"
              :error-label="errorLabel(`data.users.${i}.data.password`)"
            >
              <q-input
                class="full-width"
                :float-label="$t('register.password')"
                type="password"
                v-model="user.data.password"
              />
            </q-field>
          </template>
          <q-field v-if="!complete" class="q-mt-md">
            <q-btn class="full-width" color="primary" :label="$t('register.submitForm')" />
          </q-field>
        </form>
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
  name: 'PageRegistration',
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
  computed: {
    passwordLength: () => MIN_PASSWORD_LENGTH
  },
  validations: {
    form: {
      data: {
        name: {required},
        users: {
          required,
          $each: {
            data: {
              email: {required, email},
              password: {required, minLength: minLength(MIN_PASSWORD_LENGTH)}
            }
          }
        }
      }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }

      for (let v in this.errors) {
        this.errors[v] = []
      }

      this.$axios
        .post('/companies', this.form)
        .then(response => {
          this.complete = true
          this.$q.notify({
            message: this.$t('register.verifyEmail'),
            timeout: 0,
            type: 'positive'
          })
        })
        .catch(error => {
          switch (error.response.status) {
            case 422:
              this.errors = {...this.errors, ...error.response.data.errors}
              break
            default:
          }
        })
    },
    // I tried plugins and shit for this but the vue documentation is crap and I couldn't figure out how to access
    // 'this' whatever 'this' is...
    // So... feel free to copy and paste these methods all over the code.
    hasErrors: function (key, vuelidateError) {
      return this.errors[key].length > 0 || vuelidateError
    },
    errorLabel: function (key) {
      return this.errors[key].reduce((message, error) => message + '\n' + this.$t(error), '')
    }
  }
}
</script>
