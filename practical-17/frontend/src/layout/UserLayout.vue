<template>
  <div class="min-h-screen bg-[#f8f6f3]">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="flex items-center">
            <h1 class="text-2xl font-light tracking-widest text-gray-900">
              StyleSphere
            </h1>
          </router-link>

          <nav class="hidden md:flex items-center gap-6">
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              :class="{ 'text-gray-900 font-medium': $route.path === '/' }"
            >
              Home
            </router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link 
                to="/favorites" 
                class="text-gray-600 hover:text-gray-900 transition-colors"
                :class="{ 'text-gray-900 font-medium': $route.path === '/favorites' }"
              >
                Favorites
                <span v-if="favoritesStore.favoriteCount > 0" class="ml-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {{ favoritesStore.favoriteCount }}
                </span>
              </router-link>
            </template>
          </nav>

          <div class="flex items-center gap-3">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-gray-600 hidden sm:block">
                Hi, {{ authStore.user?.name }}
              </span>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
              >
                Sign Up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useFavoritesStore } from '../stores/favorites';

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const handleLogout = () => {
  authStore.logout();
  favoritesStore.clearFavorites();
  router.push('/');
};
</script>
