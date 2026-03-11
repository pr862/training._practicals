import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store';

import UserLayout from '@/layouts/UserLayout.vue';
import Login from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import HomePage from '@/pages/users/HomePage.vue';
import UserFavorites from '@/pages/users/UserFavorites.vue';
import Feedback from '@/pages/users/Feedback.vue';

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
      {
        path: 'feedback',
        name: 'Feedback',
        component: Feedback,
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
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return '/';
  }
  
  return true;
});

export default router;
