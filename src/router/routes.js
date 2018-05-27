
export default [
  {
    path: '/',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/index.vue') },
      { path: '/login', name: 'login', component: () => import('pages/login.vue') },
      { path: '/register', name: 'register', component: () => import('pages/register.vue') },
      { path: '/user/verify/:code', name: 'verify', component: () => import('pages/verify.vue') },
      { path: '/customers/new', name: 'customer-new', component: () => import('pages/customer-edit.vue') },
      { path: '/customers/:id/edit', name: 'customer-edit', component: () => import('pages/customer-edit.vue') }
    ]
  },

  {
    path: '*',
    component: () => import('pages/404.vue')
  }
]
