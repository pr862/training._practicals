<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-olive-900">My Favorites</h1>
      <p class="text-olive-600 mt-1">Products you've saved for later</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <div v-else-if="favoritesStore.favorites.length === 0" class="text-center py-20">
      <svg class="mx-auto h-16 w-16 text-olive-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-olive-900">No favorites yet</h3>
      <p class="mt-2 text-sm text-olive-500">Start browsing and add products to your favorites!</p>
      <router-link
        to="/"
        class="inline-block mt-4 px-6 py-3 bg-olive-900 text-white font-medium rounded-lg hover:bg-olive-800 transition-colors"
      >
        Browse Products
      </router-link>
    </div>

    <div v-else>
      <p class="text-sm text-gray-600 mb-6">
        You have {{ favoritesStore.favorites.length }} favorite{{ favoritesStore.favorites.length !== 1 ? 's' : '' }}
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="product in favoritesStore.favorites"
          :key="product.id"
         class="bg-olive-50 rounded-2xl border border-olive-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
        >
          <div class="relative aspect-square bg-olive-50 overflow-hidden cursor-pointer">
            
            <img
              v-if="product.image"
              :src="product.image.startsWith('/uploads/') ? product.image : `/uploads/${product.image}`"
              :alt="product.name"
              @click="openImageModal(product.image.startsWith('/uploads/') ? product.image : `/uploads/${product.image}`)"
              class="w-full h-full object-contain"
            />

            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <button
              @click.stop="removeFavorite(product.id)"
              class="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-pink-500 hover:text-pink-600"
              title="Remove from favorites"
            >
              <svg class="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div class="p-4">
            <h3 class="font-semibold text-gray-600 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>

            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-900">
                ${{ product.price.toFixed(2) }}
              </span>

              <span
                class="text-xs px-2 py-1 rounded-lg"
                :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showImageModal && selectedImage"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click.self="closeImageModal"
    >
      <button
        @click="closeImageModal"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <img
        :src="selectedImage"
        alt="Full size image"
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFavoritesStore } from '../../stores/favorites'

const favoritesStore = useFavoritesStore()

const loading = computed(() => favoritesStore.loading)
const error = computed(() => favoritesStore.error)

const selectedImage = ref<string | null>(null)
const showImageModal = ref(false)

const removeFavorite = async (productId: number) => {
  await favoritesStore.removeFavorite(productId)
}

const openImageModal = (imageSrc: string) => {
  selectedImage.value = imageSrc
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = null
}

onMounted(async () => {
  await favoritesStore.fetchFavorites()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>