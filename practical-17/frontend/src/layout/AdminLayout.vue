<template>
  <div class="flex min-h-screen bg-gray-50">
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-6 border-b border-gray-800">
        <h1 class="text-2xl font-bold tracking-wider">StyleSphere</h1>
        <p class="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </router-link>

        <router-link
          to="/admin/users"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/users' ? 'bg-blue-600' : 'hover:bg-gray-800'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </router-link>

        <router-link
          to="/admin/categories"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/categories' ? 'bg-blue-600' : 'hover:bg-gray-800'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </router-link>

        <router-link
          to="/admin/subcategories"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/subcategories' ? 'bg-blue-600' : 'hover:bg-gray-800'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Subcategories
        </router-link>

        <router-link
          to="/admin/products"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/products' ? 'bg-blue-600' : 'hover:bg-gray-800'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Products
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span class="text-sm font-bold">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const userInitials = computed(() => {
  if (!authStore.user?.name) return '?';
  return authStore.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
