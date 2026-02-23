import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import AdminLayout from '../layout/AdminLayout.vue';
import UserLayout from '../layout/UserLayout.vue';
import Login from '../auth/Login.vue';
import Register from '../auth/Register.vue';
import HomePage from '../views/users/HomePage.vue';
import UserFavorites from '../views/users/UserFavorites.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import Categories from '../views/admin/Categories.vue';
import Subcategories from '../views/admin/Subcategories.vue';
import Products from '../views/admin/Products.vue';
import Users from '../views/admin/Users.vue';

const routes = [
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: UserFavorites,
        meta: { requiresAuth: true },
      },
    ],
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
        path: 'subcategories',
        name: 'Subcategories',
        component: Subcategories,
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
  history: createWebHistory(),
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
    } else {
      return '/';
    }
  }
  
  return true;
});

export default router;
