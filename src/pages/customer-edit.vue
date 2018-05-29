<template v-if="userIsActive">
  <q-page>
    <q-card flat>
      <q-card-title>
        <template v-if="form.data.id">{{ $t('customer.edit.formTitleEdit', { name: this.form.data.name }) }}</template>
        <template v-else>{{ $t('customer.edit.formTitleNew') }}</template>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <form @submit.prevent="submit">
          <q-field
            :error="hasErrors('data.name', $v.form.data.name.$error)"
            :error-label="errorLabel('data.name')"
            icon="person"
            class="q-mb-md"
          >
            <q-input
              class="full-width"
              :float-label="$t('customer.edit.name')"
              v-model="form.data.name"
            />
          </q-field>
          <q-field
            icon="email"
            :error="hasErrors('data.email', $v.form.data.email.$error)"
            :error-label="errorLabel('data.email')"
            class="q-mb-md"
          >
            <q-input
              class="full-width"
              :float-label="$t('customer.edit.email')"
              v-model="form.data.email"
              type="email"
            />
          </q-field>
          <q-field
            icon="phone"
            :error="hasErrors('data.telephone')"
            :error-label="errorLabel('data.telephone')"
            class="q-mb-md"
          >
            <q-input
              class="full-width"
              :float-label="$t('customer.edit.telephone')"
              v-model="form.data.telephone"
            />
          </q-field>
          <q-list separator class="q-mb-md">
            <q-list-header>{{ $t('customer.edit.notes.heading') }}</q-list-header>
            <q-item>
              <q-item-main>
                <q-item-tile v-for="(note, i) in form.data.notes" :key="'note-item'+i">
                  <q-field
                    :key="'note' + i"
                    :error="hasErrors(`data.notes.${i}.data.note`, $v.form.data.notes.$each[i].data.note.$error)"
                    :error-label="errorLabel(`data.notes.${i}.data.note`)"
                    class="q-mb-md"
                  >
                    <q-input
                      class="full-width"
                      :float-label="$t('customer.edit.notes.note')"
                      v-model="note.data.note"
                      :after="[ { icon: 'clear', handler () { removeNote(i) } } ]"
                    />
                  </q-field>
                </q-item-tile>
                <q-field v-if="!complete">
                  <q-btn
                    icon="add"
                    class="float-right"
                    color="tertiary"
                    :label="$t('customer.edit.notes.addNote')"
                    @click.prevent="addNote"
                  />
                </q-field>
              </q-item-main>
            </q-item>
          </q-list>
          <q-field v-if="!complete" class="q-mb-md">
            <q-btn class="full-width" color="primary" :label="$t('customer.edit.submitForm')" />
          </q-field>
        </form>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { email, maxLength, required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import customer from '../store/customer'

export default {
  data () {
    return {
      complete: false,
      form: {
        data: {
          name: '',
          email: null,
          telephone: null,
          notes: [{data: {note: null}}]
        }
      },
      errors: {
        'data.id': [],
        'data.name': [],
        'data.email': [],
        'data.telephone': [],
        'data.notes.0.data.note': []
      }
    }
  },
  validations: {
    form: {
      data: {
        name: { required },
        email: { email },
        notes: {
          $each: {
            data: {
              note: { maxLength: maxLength(200) }
            }
          }
        }
      }
    }
  },
  created () {
    if (!this.userIsLoading && !this.userIsActive) {
      this.$router.replace({ name: 'login' })
    }
  },
  watch: {
    userIsActive (newValue, oldValue) {
      if (!newValue) {
        this.$router.replace({ name: 'login' })
      }
    }
  },
  computed: {
    ...mapGetters('user', ['userIsActive', 'userIsLoading', 'userCompanyId']),
    ...mapGetters('accessToken', ['isAccessTokenSet'])
  },
  methods: {
    async submit () {
      this.resetErrors()
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }

      try {
        let request = this.$axios.post(`/companies/${this.userCompanyId}/customers`, this.form)
        let id = (await request).data.data.id

        if (!(`customer-${id}` in this.$store._modules.root._children)) {
          this.$store.registerModule(`customer-${id}`, customer)
        }

        await this.$store.dispatch(`customer-${id}/loadCustomer`, request)

        this.$router.push({ name: 'customer-view', params: { id } })
      } catch (error) {
        if (!error.hasOwnProperty('response')) {
          throw error
        }

        switch (error.response.status) {
          case 422:
            this.errors = { ...this.errors, ...error.response.data.errors }
            break
          default:
            throw error
        }
      }
    },
    removeNote (i) {
      // We don't need to remove the errors key in this situation.
      this.form.data.notes.splice(i, 1)
      if (this.form.data.notes.length === 0) {
        this.addNote()
      }
    },
    addNote () {
      let i = this.form.data.notes.length
      this.form.data.notes.push({data: {note: null}})
      if (!this.errors.hasOwnProperty(`data.notes.${i}.data.note`)) {
        this.errors[`data.notes.${i}.data.note`] = []
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
