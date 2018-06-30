
export default [
  {
    path: '/',
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'index',
        meta: { requiresUser: true },
        component: () => import('pages/index.vue')
      },
      {
        path: '/login',
        name: 'login',
        meta: { requiresUser: false },
        component: () => import('pages/login.vue')
      },
      {
        path: '/register',
        name: 'register',
        meta: { requiresUser: false },
        component: () => import('pages/register.vue')
      },
      {
        path: '/user/verify/:code',
        name: 'verify',
        meta: { requiresUser: false },
        component: () => import('pages/verify.vue')
      },
      {
        path: '/customers/new',
        name: 'customer-new',
        meta: { requiresUser: true },
        component: () => import('pages/customer-edit.vue')
      },
      {
        path: '/customers/:id',
        name: 'customer-view',
        meta: { requiresUser: true },
        component: () => import('pages/customer-view.vue')
      },
      {
        path: '/customers/:id/edit',
        name: 'customer-edit',
        meta: { requiresUser: true },
        component: () => import('pages/customer-edit.vue')
      },
      {
        path: '/measurement-settings',
        name: 'measurement-settings',
        meta: { requiresUser: true },
        component: () => import('pages/measurement-settings.vue')
      }
    ]
  },

  { path: '*', name: '404', component: () => import('pages/404.vue') }
]
