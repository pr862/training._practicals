<template>
  <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
    <div class="lg:hidden">
      <button
        @click="showMobileFilters = true"
        class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-olive-300 bg-white text-olive-900 shadow-sm min-w-28"
      >
        Filters
      </button>
    </div>

    <div
      v-if="showMobileFilters"
      class="lg:hidden fixed inset-0 z-40 bg-black/40"
      @click="showMobileFilters = false"
    ></div>

    <aside
      class="w-full lg:w-64 flex-shrink-0"
      :class="showMobileFilters ? 'fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-sm' : 'hidden lg:block'"
    >
      <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto lg:max-h-none">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-olive-900">Filters</h2>
          <div class="flex items-center gap-2">
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-xs sm:text-sm text-red-600 hover:text-red-700 cursor-pointer"
            >
              Clear all
            </button>
            <button
              @click="showMobileFilters = false"
              class="lg:hidden inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Categories</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                :checked="selectedCategory === null"
                @change="setCategory(null)"
                class="size-4 text-black border-gray-300 focus:ring-black"
              />
              <span class="text-sm text-gray-600 group-hover:text-gray-900">All Categories</span>
            </label>

            <div v-for="group in categoriesWithSubcategories" :key="group.parent.id">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  :checked="selectedCategory === group.parent.id"
                  @change="setCategory(group.parent.id)"
                  class="size-4 text-black border-gray-300 focus:ring-black"
                />
                <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{{ group.parent.name }}</span>
              </label>
              
              <div v-if="group.subcategories.length > 0" class="ml-4 space-y-2 mt-1">
                <label
                  v-for="sub in group.subcategories"
                  :key="sub.id"
                  class="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    :checked="selectedCategory === sub.id"
                    @change="setCategory(sub.id)"
                    class="size-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span class="text-sm text-gray-500 group-hover:text-gray-700">{{ sub.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
          <div class="flex items-center gap-2">
            <input
              v-model.number="minPrice"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none text-sm"
            />
            <span class="text-gray-400">-</span>
            <input
              v-model.number="maxPrice"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none text-sm"
            />
          </div>
          <button
            @click="applyFilters"
            class="w-full mt-3 px-4 py-2.5 bg-olive-800 text-white text-sm font-medium rounded-lg hover:bg-olive-900 transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {{ error }}
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
        <h3 class="text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-olive-50 rounded-2xl border border-olive-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div class="relative aspect-square bg-olive-50 overflow-hidden cursor-pointer">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                @click="openImageModal([product.image])"
                class="w-full h-full object-contain cursor-pointer"
              />

              <button
                v-if="authStore.isAuthenticated"
                @click.stop="toggleFavorite(product.id)"
                class="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white shadow-md cursor-pointer"
                :class="favoritesStore.isFavorite(product.id) ? 'text-pink-500' : 'text-gray-400'"
              >
                <svg 
                  class="size-5" 
                  :fill="favoritesStore.isFavorite(product.id) ? 'currentColor' : 'none'"
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button
                v-else
                @click.stop="redirectToLogin"
                class="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white shadow-md text-gray-400 cursor-pointer"
              >
                <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm sm:text-base">
                {{ product.name }}
              </h3>
              <p class="text-xs text-gray-500 mb-2">
                {{ getProductCategoryName(product) }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-base sm:text-lg font-semibold text-gray-900">
                  ₹{{ product.price.toFixed(2) }}
                </span>
                <span 
                  class="text-[11px] sm:text-xs px-2 py-1 rounded-lg"
                  :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-if="showImageModal && selectedImages.length > 0" 
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 cursor-pointer"
      @click.self="closeImageModal"
    >
      <button
        @click="closeImageModal"
        class="absolute top-4 right-4 text-white text-2xl font-bold"
      >
        ✕
      </button>
      <div class="flex gap-4 overflow-x-auto max-w-full max-h-full">
        <img
          v-for="img in selectedImages"
          :key="img"
          :src="img"
          class="max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore, useAuthStore, useFavoritesStore } from '@/store'
import type { Category, Product } from '@/types'

const router = useRouter()
const productsStore = useProductsStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const minPrice = ref<number | undefined>()
const maxPrice = ref<number | undefined>()
const selectedImages = ref<string[]>([])
const showImageModal = ref(false)
const showMobileFilters = ref(false)

const categories = computed(() => productsStore.categories)
const filteredProducts = computed(() => productsStore.filteredProducts)
const loading = computed(() => productsStore.loading)
const error = computed(() => productsStore.error)
const selectedCategory = computed(() => productsStore.selectedCategory)

const categoriesWithSubcategories = computed(() => {
  const parentCategories = categories.value.filter((cat: Category) => !cat.parent_id || cat.parent_id === null);
  return parentCategories.map((parent: Category) => ({
    parent,
    subcategories: categories.value.filter((cat: Category) => cat.parent_id === parent.id)
  }));
});

const hasActiveFilters = computed(() =>
  selectedCategory.value !== null ||
  minPrice.value !== undefined ||
  maxPrice.value !== undefined
)

const setCategory = (categoryId: number | null) => {
  productsStore.setSelectedCategory(categoryId)
}

const applyFilters = () => {
  productsStore.setSelectedCategory(productsStore.selectedCategory)
  productsStore.setPriceRange(minPrice.value, maxPrice.value)
  showMobileFilters.value = false
}

const clearFilters = () => {
  minPrice.value = undefined
  maxPrice.value = undefined
  productsStore.clearFilters()
  showMobileFilters.value = false
}

const toggleFavorite = async (productId: number) => {
  await favoritesStore.toggleFavorite(productId)
}

const redirectToLogin = () => {
  router.push('/login')
}

const openImageModal = (images: string[]) => {
  selectedImages.value = images
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImages.value = []
}

const getCategoryName = (categoryId: number) => {
  const match = categories.value.find((cat: Category) => cat.id === categoryId)
  return match?.name || 'N/A'
}

const getProductCategoryName = (product: Product) => {
  if (product.Category?.name) return product.Category.name
  return getCategoryName(product.categoryId)
}

onMounted(async () => {
  await Promise.all([
    productsStore.fetchCategories(),
    productsStore.fetchProducts(),
  ])

  if (authStore.isAuthenticated) {
    await favoritesStore.fetchFavorites()
  }
})
</script>
