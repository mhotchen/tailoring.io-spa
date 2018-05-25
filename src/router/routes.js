
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', name: 'index', component: () => import('pages/index.vue') },
      { path: '/login', name: 'login', component: () => import('pages/login.vue') },
      { path: '/register', name: 'register', component: () => import('pages/register.vue') },
      { path: '/user/verify/:code', name: 'verify', component: () => import('pages/verify.vue') }
    ]
  },

  {
    path: '*',
    component: () => import('pages/404.vue')
  }
]
