<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-500 mt-1">Manage product categories</p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Category
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-olive-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-olive-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id" class="hover:bg-olive-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(category.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                @click="openModal(category)"
                class="text-olive-700 mr-4 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
               </svg>

              </button>
              <button
                @click="deleteCategory(category.id)"
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
          <tr v-if="categories.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-gray-500">No categories found</td>
          </tr>
        </tbody>
      </table>
    </div>

<div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingCategory ? 'Edit Category' : 'Add Category' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
              placeholder="Enter category name"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
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
              {{ loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { categoryAPI } from '../../services/api';

interface Category {
  id: number;
  name: string;
  createdAt: string;
}

const categories = ref<Category[]>([]);
const showModal = ref(false);
const editingCategory = ref<Category | null>(null);
const loading = ref(false);
const errors = ref<Record<string, string>>({});

const formData = ref({
  name: '',
});

const fetchCategories = async () => {
  try {
    const response = await categoryAPI.getAll();
    categories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const openModal = (category?: Category) => {
  if (category) {
    editingCategory.value = category;
    formData.value.name = category.name;
  } else {
    editingCategory.value = null;
    formData.value.name = '';
  }
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCategory.value = null;
  formData.value.name = '';
  errors.value = {};
};

const handleSubmit = async () => {
  errors.value = {};
  
  if (!formData.value.name || formData.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    return;
  }

  loading.value = true;
  try {
    if (editingCategory.value) {
      await categoryAPI.update(editingCategory.value.id, { name: formData.value.name });
    } else {
      await categoryAPI.create({ name: formData.value.name });
    }
    await fetchCategories();
    closeModal();
  } catch (error: any) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
    } else {
      console.error('Failed to save category:', error);
    }
  } finally {
    loading.value = false;
  }
};

const deleteCategory = async (id: number) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  
  try {
    await categoryAPI.delete(id);
    await fetchCategories();
  } catch (error) {
    console.error('Failed to delete category:', error);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchCategories();
});
</script>
