
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', name: 'login', component: () => import('pages/index') },
      { path: '/register', name: 'register', component: () => import('pages/register') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
