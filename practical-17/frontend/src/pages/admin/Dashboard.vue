<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">Welcome back, {{ authStore.user?.name }}!</p>
    </div>

     <div v-if="analyticError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-4">
      {{ analyticError }}
    </div>
    <div v-if="catError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-4">
      {{ catError }}
     </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.userCount }}</p>
          </div>
          <div class="size-12 bg-olive-200 rounded-lg flex items-center justify-center">
            <div class="icon-users size-6 bg-olive-500"></div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.productCount }}</p>
          </div>
          <div class="size-12 bg-green-100 rounded-lg flex items-center justify-center">
            <div class="icon-products size-6 bg-green-600"></div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Categories</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.categoryCount }}</p>
          </div>
          <div class="size-12 bg-purple-100 rounded-lg flex items-center justify-center">
           <div class="icon-categories size-6 bg-purple-600"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <router-link
          to="/admin/categories"
          class="flex items-center gap-3 p-4 bg-olive-50 hover:bg-olive-100 rounded-lg transition-colors"
        >
          <div class="size-10 bg-olive-500 rounded-lg flex items-center justify-center">
            <img src ="/icons/add.svg" alt="Add Icon" class="size-5 text-white"/>
          </div>
          <span class="font-medium text-gray-900">Add Category</span>
        </router-link>

        <router-link
          to="/admin/products"
          class="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
        >
          <div class="size-10 bg-green-600 rounded-lg flex items-center justify-center">
            <img src ="/icons/add.svg" alt="Add Icon" class="size-5 text-white"/>
          </div>
          <span class="font-medium text-gray-900">Add Product</span>
        </router-link>

        <router-link
          to="/admin/users"
          class="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
        >
          <div class="size-10 bg-orange-600 rounded-lg flex items-center justify-center">
            <div class="icon-users size-6 bg-white"></div>
          </div>
          <span class="font-medium text-gray-900">View Users</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useAuthStore } from '@/store';
import { analyticsAPI, categoryAPI } from '@/services';
import type { Analytics } from '@/types';

const authStore = useAuthStore();
const analyticError = ref<string | null>(null);
const catError = ref<string | null>(null);

const analytics = ref<Analytics>({
  userCount: 0,
  productCount: 0,
  categoryCount: 0,
});

const fetchanalytics = async () => {
  analyticError.value = null;
  try {
    analytics.value = await analyticsAPI.get();
    const categories = await categoryAPI.getAll();
    analytics.value.categoryCount = categories.length;
  } catch (error:any) {
    analyticError.value = error.response?.data?.message || 'Failed to fetch analytics. Please try again.';
    try {
      const categories = await categoryAPI.getAll();
      analytics.value.categoryCount = categories.length;
    } catch (catError:any) {
      catError.value = catError.response?.data?.message || 'Failed to fetch category count. Please try again.';
    }
  }
};

onMounted(() => {
  fetchanalytics();
});

onBeforeRouteUpdate((to, from) => {
  if (to.path === '/admin/dashboard' && from.path !== '/admin/dashboard') {
    fetchanalytics();
  }
});
</script>
