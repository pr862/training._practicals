import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/store';

import AdminLayout from '@/layouts/AdminLayout.vue';
import Login from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import Dashboard from '@/pages/admin/Dashboard.vue';
import Categories from '@/pages/admin/Categories.vue';
import Products from '@/pages/admin/Products.vue';
import Users from '@/pages/admin/Users.vue';

const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'categories',
        name: 'Categories',
        component: Categories,
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return '/login';
    }
    
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return '/login';
    }
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      return '/admin/dashboard';
    }

    authStore.logout();
    return true;
  }
  
  return true;
});

export default router;
