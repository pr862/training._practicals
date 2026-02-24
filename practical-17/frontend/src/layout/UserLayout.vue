<template>
  <div class="min-h-screen bg-olive-50">
    <header class="bg-olive-900 shadow-sm sticky top-0 z-50">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="flex items-center">
            <h1 class="text-2xl font-light tracking-widest text-olive-50">
              StyleSphere
            </h1>
          </router-link>

          <div class="relative flex-1 max-w-2xl mx-4 lg:mx-8">
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search for products, categories, brands..."
                class="w-full px-5 py-2.5 pl-11 text-olive-50 border-1 border-olive-50 rounded-xl focus:ring-2 focus:ring-olive-50 focus:border-olive-50 outline-none transition-all placeholder:text-olive-50"
                @keyup.enter="handleSearch"
              />
              <svg 
                class="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-olive-50"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-olive-50 transition-colors"
              >
                <svg class="size-5 text-olive-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          <nav class="hidden md:flex items-center gap-6">
            <router-link 
              to="/" 
              class="text-olive-50 hover:text-olive-500 transition-colors"
              :class="{ 'text-olive-50 font-medium': $route.path === '/' }"
            >
              Home
            </router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link 
                to="/favorites" 
                class="text-olive-50 hover:text-olive-500 transition-colors"
                :class="{ 'text-gray-900 font-medium': $route.path === '/favorites' }"
              >
                Favorites
                <span v-if="favoritesStore.favoriteCount > 0" class="ml-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {{ favoritesStore.favoriteCount }}
                </span>
              </router-link>
              <router-link 
                to="/feedback" 
                class="text-olive-50 hover:text-olive-500 transition-colors"
                :class="{ 'text-gray-900 font-medium': $route.path === '/feedback' }"
              >
                reviews
              </router-link>
            </template>
          </nav>

          <div class="flex items-center gap-3">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-olive-50 hidden sm:block">
                Hi, {{ authStore.user?.name }}
              </span>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium bg-olive-500 rounded-lg text-olive-50 hover:text-olive-300 transition-colors"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="px-4 py-2 bg-olive-600 text-olive-50 text-sm font-medium rounded-lg hover:bg-olive-600 transition-colors"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="px-4 py-2 bg-olive-500 text-olive-50 text-sm font-medium rounded-lg hover:bg-olive-600 transition-colors"
              >
                Sign Up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useFavoritesStore } from '../stores/favorites';
import { useProductsStore } from '../stores/products';

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const productsStore = useProductsStore();

const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const handleSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    router.push('/');
    productsStore.fetchProducts({ search: query });
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchInput.value?.focus();
};

const handleLogout = () => {
  authStore.logout();
  favoritesStore.clearFavorites();
  router.push('/');
};
</script>
