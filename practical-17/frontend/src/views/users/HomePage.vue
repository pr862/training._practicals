<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <aside class="w-full lg:w-64 flex-shrink-0">
      <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Categories</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                :checked="selectedCategory === null"
                @change="setCategory(null)"
                class="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <span class="text-sm text-gray-600 group-hover:text-gray-900">All Categories</span>
            </label>

            <label
              v-for="category in categories"
              :key="category.id"
              class="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                :checked="selectedCategory === category.id"
                @change="setCategory(category.id)"
                class="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <span class="text-sm text-gray-600 group-hover:text-gray-900">{{ category.name }}</span>
            </label>
          </div>
        </div>

        <div v-if="selectedCategory && filteredSubcategories.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Subcategories</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                :checked="selectedSubcategory === null"
                @change="setSubcategory(null)"
                class="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <span class="text-sm text-gray-600 group-hover:text-gray-900">All Subcategories</span>
            </label>

            <label
              v-for="subcategory in filteredSubcategories"
              :key="subcategory.id"
              class="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                :checked="selectedSubcategory === subcategory.id"
                @change="setSubcategory(subcategory.id)"
                class="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <span class="text-sm text-gray-600 group-hover:text-gray-900">{{ subcategory.name }}</span>
            </label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
          <div class="flex items-center gap-2">
            <input
              v-model.number="minPrice"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
            />
            <span class="text-gray-400">-</span>
            <input
              v-model.number="maxPrice"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
            />
          </div>
          <button
            @click="applyFilters"
            class="w-full mt-3 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {{ error }}
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
        <h3 class="text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-olive-50 rounded-2xl border border-olive-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
           <div class="relative aspect-square bg-olive-50 overflow-hidden cursor-pointer">
              <img
                v-if="product.image"
                :src="product.image.startsWith('/uploads/') ? product.image : `/uploads/${product.image}`"
                :alt="product.name"
                @click="openImageModal(product.image.startsWith('/uploads/') ? product.image : `/uploads/${product.image}`)"
                class="w-full h-full object-contain cursor-pointer"
              />

              <button
                v-if="authStore.isAuthenticated"
                @click.stop="toggleFavorite(product.id)"
                class="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md"
                :class="favoritesStore.isFavorite(product.id) ? 'text-pink-500' : 'text-gray-400'"
              >
                <svg 
                  class="w-5 h-5" 
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
                class="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-gray-400"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">
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
    </div>

    <div 
      v-if="showImageModal && selectedImage" 
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click.self="closeImageModal"
    >
      <button
        @click="closeImageModal"
        class="absolute top-4 right-4 text-white"
      >
        ✕
      </button>
      <img
        :src="selectedImage"
        class="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../../stores/products'
import { useAuthStore } from '../../stores/auth'
import { useFavoritesStore } from '../../stores/favorites'

const router = useRouter()
const productsStore = useProductsStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const minPrice = ref<number | undefined>()
const maxPrice = ref<number | undefined>()
const selectedImage = ref<string | null>(null)
const showImageModal = ref(false)

const categories = computed(() => productsStore.categories)
const subcategories = computed(() => productsStore.subcategories)
const filteredProducts = computed(() => productsStore.filteredProducts)
const loading = computed(() => productsStore.loading)
const error = computed(() => productsStore.error)
const selectedCategory = computed(() => productsStore.selectedCategory)
const selectedSubcategory = computed(() => productsStore.selectedSubcategory)

const filteredSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  return subcategories.value.filter(s => s.categoryId === selectedCategory.value)
})

const hasActiveFilters = computed(() =>
  selectedCategory.value !== null ||
  selectedSubcategory.value !== null ||
  minPrice.value !== undefined ||
  maxPrice.value !== undefined
)

const setCategory = (categoryId: number | null) => {
  productsStore.setSelectedCategory(categoryId)
  productsStore.fetchProducts({
    categoryId: categoryId || undefined,
    subcategoryId: productsStore.selectedSubcategory || undefined,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  })
}

const setSubcategory = (subcategoryId: number | null) => {
  productsStore.setSelectedSubcategory(subcategoryId)
  productsStore.fetchProducts({
    categoryId: productsStore.selectedCategory || undefined,
    subcategoryId: subcategoryId || undefined,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  })
}

const applyFilters = () => {
  productsStore.fetchProducts({
    categoryId: productsStore.selectedCategory || undefined,
    subcategoryId: productsStore.selectedSubcategory || undefined,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  })
}

const clearFilters = () => {
  minPrice.value = undefined
  maxPrice.value = undefined
  productsStore.setSelectedCategory(null)
  productsStore.setSelectedSubcategory(null)
  productsStore.fetchProducts()
}

const toggleFavorite = async (productId: number) => {
  await favoritesStore.toggleFavorite(productId)
}

const redirectToLogin = () => {
  router.push('/login')
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
  await Promise.all([
    productsStore.fetchCategories(),
    productsStore.fetchSubcategories(),
    productsStore.fetchProducts(),
  ])

  if (authStore.isAuthenticated) {
    await favoritesStore.fetchFavorites()
  }
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