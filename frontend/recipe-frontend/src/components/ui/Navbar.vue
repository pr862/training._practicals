<template>
  <nav class="fixed inset-x-0 top-0 z-50 w-full border-b border-pink-900/20 bg-neutral-900 shadow-sm backdrop-blur-sm" aria-label="Main navigation">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4 w-full">
        
        <RouterLink :to="homeLink" class="flex items-center gap-2 group">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 shadow-md shadow-pink-500/20 transition-transform group-hover:scale-[1.02]">
            <ChefHat class="size-6 text-white" />
          </div>
          <span class="font-bold text-xl text-transparent bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text">
            Recipe Book
          </span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-4">
          <template v-if="authStore.isLoggedIn">
            <template v-if="authStore.isAdmin">
              <RouterLink
                to="/admin/dashboard"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors rounded-lg"
              >
                <LayoutDashboard class="size-4" />
                Admin Panel
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink
                to="/chef/dashboard"
                class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
              >
                My Recipes
              </RouterLink>
              <RouterLink
                to="/chef/submit"
                class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Submit Recipe
              </RouterLink>
            </template>

            <div class="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div class="flex items-center gap-2">
                <User class="size-4 text-gray-400" />
                <span class="text-sm text-gray-300">{{ authStore.user?.name || 'User' }}</span>
              </div>
              <button
                @click="handleLogout"
                class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 cursor-pointer hover:text-red-400 transition-colors rounded-lg"
              >
                <LogOut class="size-4" />
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:scale-[1.02] transition-all"
            >
              Join as a Chef
            </RouterLink>
          </template>
        </div>

        <button 
          class="md:hidden p-2 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 outline-none rounded-md" 
          @click="toggleMenu" 
          :aria-expanded="isOpen" 
          aria-label="Toggle navigation menu"
        >
          <Menu v-if="!isOpen" class="size-6" />
          <X v-else class="size-6" />
        </button>
      </div>

      <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" @click="closeMenu" aria-hidden="true"></div>

      <div v-if="isOpen" class="md:hidden">
        <div class="fixed inset-x-0 top-16 z-50 w-full bg-neutral-900/95 backdrop-blur-md border-b border-pink-900/20 py-4 px-4 space-y-4">
          <template v-if="authStore.isLoggedIn">
            <template v-if="authStore.isAdmin">
              <RouterLink
                to="/admin/dashboard"
                class="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                @click="closeMenu"
              >
                <LayoutDashboard class="size-4" />
                Admin Panel
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink
                to="/chef/dashboard"
                class="block px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                @click="closeMenu"
              >
                My Recipes
              </RouterLink>
              <RouterLink
                to="/chef/submit"
                class="block px-4 py-3 bg-orange-400 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors text-center"
                @click="closeMenu"
              >
                Submit Recipe
              </RouterLink>
            </template>

            <div class="pl-4 border-t border-gray-700 pt-4">
              <div class="flex items-center gap-3 mb-4">
                <User class="size-5 text-gray-400" />
                <span class="text-sm font-medium text-gray-300">{{ authStore.user?.name || 'User' }}</span>
              </div>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-300 cursor-pointer hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut class="size-5" />
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="block px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              @click="closeMenu"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold rounded-lg hover:scale-[1.02] transition-all text-center"
              @click="closeMenu"
            >
              Join as a Chef
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <Modal 
    :isOpen="showLogoutModal" 
    @close="showLogoutModal = false" 
    @confirm="confirmLogout" 
    title="Confirm Logout" 
    confirm-text="Logout"
  >
    <p class="text-md mb-5 text-white/50">Are you sure you want to log out? Any unsaved changes will be lost.</p>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChefHat, LogOut, User, LayoutDashboard, Menu, X } from '@lucide/vue'
import { useAuthStore } from '../../stores/auth'
import Modal from './Modal.vue'

const authStore = useAuthStore()
const isOpen = ref(false)

const homeLink = computed(() => {
  if (!authStore.isLoggedIn) return '/'
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.isChef) return '/chef/dashboard'
  return '/'
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const showLogoutModal = ref(false)

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
  closeMenu()
}
</script>
