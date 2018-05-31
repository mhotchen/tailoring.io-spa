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
      id: null,
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

    if ('id' in this.$route.params) {
      this.id = this.$route.params.id
      this.registerModule()
      if (this.userIsActive) {
        this.load()
      }
    }
  },
  watch: {
    userIsLoading (newValue, oldValue) {
      if (!newValue && !this.userIsActive) {
        this.$router.replace({ name: 'login' })
      }

      this.load()
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
        let request = this.id
          ? this.$axios.put(`/companies/${this.userCompanyId}/customers/${this.id}`, this.form)
          : this.$axios.post(`/companies/${this.userCompanyId}/customers`, this.form)

        this.id = (await request).data.data.id

        this.registerModule()

        await this.$store.dispatch(`customer-${this.id}/loadCustomer`, request)

        this.$router.push({ name: 'customer-view', params: { id: this.id } })
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
    registerModule () {
      if (!(`customer-${this.id}` in this.$store._modules.root._children)) {
        this.$store.registerModule(`customer-${this.id}`, customer)
      }
    },
    async load () {
      try {
        await this.$store.dispatch(
          `customer-${this.id}/loadCustomer`,
          this.$axios.get(`/companies/${this.userCompanyId}/customers/${this.id}`)
        )
        this.form = this.$store.getters[`customer-${this.id}/getCustomer`]
        if (this.form.data.notes.length === 0) {
          this.addNote()
        }
        this.registerNoteErrorKeys()
      } catch (error) {
        if (!('response' in error)) {
          throw error
        }

        switch (error.response.status) {
          case 403:
          case 404:
            this.$router.replace({ name: '404' })
            break
          default:
            throw error
        }
      }
      this.loaded = true
    },
    removeNote (i) {
      // We don't need to remove the errors key in this situation.
      this.form.data.notes.splice(i, 1)
      if (this.form.data.notes.length === 0) {
        this.addNote()
      }
    },
    addNote () {
      this.form.data.notes.push({ data: { note: null } })
      this.registerNoteErrorKeys()
    },
    registerNoteErrorKeys () {
      for (let i = 0; i < this.form.data.notes.length; ++i) {
        if (`data.notes.${i}.data.note` in this.errors) {
          continue
        }

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
