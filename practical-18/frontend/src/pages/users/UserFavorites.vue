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
      <img src="/icons/heart.svg" class="mx-auto h-16 w-16 text-olive-300" alt="No favorites" />
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
              :src="product.image"
              :alt="product.name"
              @click="openImageModal([product.image])"
              class="w-full h-full object-contain"
            />

            <div v-else class="w-full h-full flex items-center justify-center">
              <img src="/icons/image-placeholder.svg" class ="size-16" alt="image icon">
            </div>

            <button
              @click.stop="removeFavorite(product.id)"
              class="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-pink-500 hover:text-pink-600 cursor-pointer"
              title="Remove from favorites"
            >
              <img src="/icons/heart-filled.svg" class="size-5" alt="Remove from favorites" />
            </button>
          </div>

          <div class="p-4">
            <h3 class="font-semibold text-gray-600 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>

            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-900">
                ₹{{ product.price.toFixed(2) }}
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
      v-if="showImageModal && selectedImages.length > 0"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click.self="closeImageModal"
    >
      <button
        @click="closeImageModal"
        class="absolute top-4 right-4 p-1 hover:bg-gray-800 rounded cursor-pointer"
      >
        <img src="/icons/close.svg" alt="Close" class="size-5 text-white" />
      </button>
      <div class="flex gap-4 overflow-x-auto max-w-full max-h-full">
        <img
          v-for="img in selectedImages"
          :key="img"
          :src="img"
          alt="Product image"
          class="max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/store/favorites'

const favoritesStore = useFavoritesStore()

const loading = computed(() => favoritesStore.loading)
const error = computed(() => favoritesStore.error)

const selectedImages = ref<string[]>([])
const showImageModal = ref(false)

const removeFavorite = async (productId: number) => {
  await favoritesStore.removeFavorite(productId)
}

const openImageModal = (images: string[]) => {
  selectedImages.value = images
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImages.value = []
}

onMounted(async () => {
  await favoritesStore.fetchFavorites()
})
</script>
