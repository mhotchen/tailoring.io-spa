<template>
  <q-layout view="hHh lpr lFr">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ $t("app.name") }}
          <div slot="subtitle">{{ $t("app.tagLine") }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
        v-if="userIsLoaded"
      >
        <q-list-header>{{ $t('app.mainDrawer.accountListHeader') }}</q-list-header>
        <q-item @click.native="$router.push({ name: 'account' })">
          <q-item-side icon="account_box" />
          <q-item-main
            :label="$t('app.mainDrawer.accountSettings')"
            :sublabel="$t('app.mainDrawer.accountSettingsSub')"
          />
        </q-item>
        <q-item @click.native="$router.push({ name: 'logout' })">
          <q-item-side icon="exit_to_app" />
          <q-item-main :label="$t('app.mainDrawer.logout')" />
        </q-item>
      </q-list>

      <q-list
        no-border
        link
        inset-delimiter
        v-if="userIsLoaded"
      >
        <q-list-header>{{ $t('app.mainDrawer.appSettingsListHeader') }}</q-list-header>
        <q-item @click.native="$router.push({ name: 'measurement-settings' })">
          <q-item-side icon="exposure" />
          <q-item-main
            :label="$t('app.mainDrawer.measurementSettings')"
            :sublabel="$t('app.mainDrawer.measurementSettingsSub')"
          />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <q-alert v-if="userIsAwaitingPasswordReset" color="warning" icon="warning" class="q-mt-md">
        {{ $t('account.awaitingPasswordReset') }}
      </q-alert>
      <q-alert v-if="userIsAwaitingEmailVerification" color="warning" icon="warning" class="q-mt-md">
        {{ $t('account.awaitingEmailVerification') }}
      </q-alert>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: mapGetters('user', ['userIsLoaded', 'userIsAwaitingEmailVerification', 'userIsAwaitingPasswordReset'])
}
</script>

<style>
</style>
