<template>
  <div class="flex h-screen overflow-hidden bg-olive-50">
    <div
      v-if="showSidebar"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="showSidebar = false"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-olive-900 text-white flex flex-col h-screen transform transition-transform duration-200 lg:static lg:translate-x-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-6 border-b border-olive-800">
        <h1 class="text-2xl font-bold tracking-wider">StyleSphere</h1>
        <p class="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/admin/dashboard"
          @click="showSidebar = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/dashboard' ? 'bg-olive-500' : 'hover:bg-olive-800'"
        >
          <img src ="/icons/dashboard.svg" alt="Dashboard Icon" class="size-5"/>
          Dashboard
        </router-link>

        <router-link
          to="/admin/users"
          @click="showSidebar = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/users' ? 'bg-olive-500' : 'hover:bg-olive-800'"
        >
         <div class="icon-users size-5 bg-white"></div>
          Users
        </router-link>

        <router-link
          to="/admin/categories"
          @click="showSidebar = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/categories' ? 'bg-olive-500' : 'hover:bg-olive-800'"
        >
         <img src ="/icons/categories.svg" alt="Categories Icon" class="size-5"/>
          Categories
        </router-link>

        <router-link
          to="/admin/products"
          @click="showSidebar = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="$route.path === '/admin/products' ? 'bg-olive-500' : 'hover:bg-olive-800'"
        >
           <div class="icon-products size-5 bg-white"></div>
          Products
        </router-link>
      </nav>

      <div class="p-4 border-t border-olive-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="size-10 rounded-full bg-olive-500 flex items-center justify-center">
            <span class="text-sm font-bold">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
        >
          <img src ="/icons/logout.svg" alt="Logout Icon" class="size-5"/>
          Logout
        </button>
      </div>
    </aside>

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <header class="lg:hidden bg-white border-b border-olive-100 px-4 py-3 flex items-center gap-3">
        <button
          @click="showSidebar = true"
          class="inline-flex items-center justify-center size-9 rounded-lg border border-olive-200 text-olive-900 cursor-pointer"
          aria-label="Open admin menu"
        >
        <img src ="/icons/menu.svg" alt="Menu Icon" class="size-5"/>
        </button>
        <h2 class="text-base font-semibold text-olive-900">Admin Panel</h2>
      </header>

      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showSidebar = ref(false);

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
  if (!confirm('Are you sure you want to logout?')) return;
  authStore.logout();
  router.push('/login');
};
watch(
  () => route.path,
  () => {
    showSidebar.value = false;
  },
);
</script>
