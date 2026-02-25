<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-500 mt-1">Manage your products</p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg transition-colors"
      >
        <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Product
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-olive-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-olive-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id" class="hover:bg-olive-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
<td class="px-6 py-4 whitespace-nowrap">
              <img 
                v-if="product.image" 
                :src="getImageUrl(product.image)" 
                alt="Product" 
                class="size-16 object-contain rounded-lg cursor-pointer hover:scale-110 transition-transform"
                @click="openImageModal(getImageUrl(product.image))"
              />
              <div v-else class="size-16 bg-olive-200 rounded-lg flex items-center justify-center">
                <svg class="size-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <span class="px-2 py-1 bg-olive-300 text-olive-800 rounded-lg text-xs">
                {{ product.Category?.name || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs">
                {{ product.Subcategory?.name || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{{ product.price }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm">
                {{ product.stock }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                @click="openModal(product)"
                class="text-olive-700 mr-4"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
               </svg>

              </button>
              <button
                @click="deleteProduct(product.id)"
                class="text-red-600 hover:text-red-900"
              >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="3 6 5 6 21 6"></polyline>
                 <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                 <line x1="10" y1="11" x2="10" y2="17"></line>
                 <line x1="14" y1="11" x2="14" y2="17"></line>
               </svg>

              </button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="8" class="px-6 py-8 text-center text-gray-500">No products found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal"  class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 my-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingProduct ? 'Edit Product' : 'Add Product' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
              placeholder="Enter product name"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
                placeholder="0.00"
                required
              />
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                v-model.number="formData.stock"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
                placeholder="0"
                required
              />
              <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="formData.categoryId"
                class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
                required
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">{{ errors.categoryId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
              <select
                v-model="formData.subcategoryId"
                class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
                required
              >
                <option value="">Select subcategory</option>
                <option v-for="sub in filteredSubcategories" :key="sub.id" :value="sub.id">
                  {{ sub.name }}
                </option>
              </select>
              <p v-if="errors.subcategoryId" class="mt-1 text-sm text-red-600">{{ errors.subcategoryId }}</p>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div class="flex items-center gap-4 rounded-lg border border-dashed border-olive-300">
              <div class="flex-shrink-0">
                <img 
                  v-if="formData.image || formData.existingImage" 
                  :src="formData.image ? URL.createObjectURL(formData.image) : getImageUrl(formData.existingImage)" 
                  alt="Preview" 
                  class="size-24 object-contain rounded-lg border border-olive-300"
                />
                <div v-else class="size-24 bg-gray-100 rounded-lg  flex items-center justify-center">
                  <svg class="size-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-olive-50 file:text-olive-700 hover:file:bg-olive-100"
                />
                <p class="mt-1 text-xs text-gray-500">Supported: JPG, PNG, GIF, WebP (max 5MB)</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-olive-300 text-gray-700 rounded-lg hover:bg-olive-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-olive-500 text-white rounded-lg hover:bg-olive-600 transition-colors"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
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
        <svg class="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
import { ref, computed, onMounted, watch } from 'vue';
import { productAPI, categoryAPI, subcategoryAPI } from '../../services/api';

const URL = window.URL;

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: number;
  subcategoryId: number;
  Category?: Category;
  Subcategory?: Subcategory;
  createdAt: string;
}

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const subcategories = ref<Subcategory[]>([]);
const showModal = ref(false);
const editingProduct = ref<Product | null>(null);
const loading = ref(false);
const errors = ref<Record<string, string>>({});
const selectedImage = ref<string | null>(null);
const showImageModal = ref(false);

const formData = ref({
  name: '',
  price: null as number | null,
  stock: null as number | null,
  categoryId: '' as number | string,
  subcategoryId: '' as number | string,
  image: null as File | null,
  existingImage: '',
});

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `https://stylesphere-4qp1.onrender.com${imagePath}`;
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.image = target.files[0];
  }
};

const filteredSubcategories = computed(() => {
  if (!formData.value.categoryId) return [];
  return subcategories.value.filter(
    (sub) => sub.categoryId === Number(formData.value.categoryId)
  );
});

const fetchProducts = async () => {
  try {
    const response = await productAPI.getAll();
    products.value = response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await categoryAPI.getAll();
    categories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const fetchSubcategories = async () => {
  try {
    const response = await subcategoryAPI.getAll();
    subcategories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
  }
};

watch(() => formData.value.categoryId, () => {
  formData.value.subcategoryId = '';
});

const openModal = (product?: Product) => {
  if (product) {
    editingProduct.value = product;
    formData.value = {
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      image: null,
      existingImage: product.image || '',
    };
  } else {
    editingProduct.value = null;
    formData.value = {
      name: '',
      price: null,
      stock: null,
      categoryId: '',
      subcategoryId: '',
      image: null,
      existingImage: '',
    };
  }
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingProduct.value = null;
  formData.value = {
    name: '',
    price: null,
    stock: null,
    categoryId: '',
    subcategoryId: '',
    image: null,
    existingImage: '',
  };
  errors.value = {};
};

const handleSubmit = async () => {
  errors.value = {};
  
  if (!formData.value.name || formData.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    return;
  }

  if (!formData.value.price || formData.value.price <= 0) {
    errors.value.price = 'Price must be a positive number';
    return;
  }

  if (formData.value.stock === null || formData.value.stock < 0) {
    errors.value.stock = 'Stock must be a non-negative number';
    return;
  }

  if (!formData.value.categoryId) {
    errors.value.categoryId = 'Please select a category';
    return;
  }

  if (!formData.value.subcategoryId) {
    errors.value.subcategoryId = 'Please select a subcategory';
    return;
  }

  loading.value = true;
  try {
    const data: any = {
      name: formData.value.name,
      price: formData.value.price,
      stock: formData.value.stock,
      categoryId: Number(formData.value.categoryId),
      subcategoryId: Number(formData.value.subcategoryId),
    };
    
    if (formData.value.image) {
      data.image = formData.value.image;
    }
    
    if (editingProduct.value) {
      await productAPI.update(editingProduct.value.id, data);
    } else {
      await productAPI.create(data);
    }
    await fetchProducts();
    closeModal();
  } catch (error: any) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
    } else {
      console.error('Failed to save product:', error);
    }
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    await productAPI.delete(id);
    await fetchProducts();
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
};

const openImageModal = (imageSrc: string) => {
  selectedImage.value = imageSrc;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  selectedImage.value = null;
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
  fetchSubcategories();
});
</script>
