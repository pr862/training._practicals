<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Subcategories</h1>
        <p class="text-gray-500 mt-1">Manage product subcategories</p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Subcategory
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="subcategory in subcategories" :key="subcategory.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ subcategory.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ subcategory.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {{ subcategory.Category?.name || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(subcategory.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                @click="openModal(subcategory)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Edit
              </button>
              <button
                @click="deleteSubcategory(subcategory.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="subcategories.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">No subcategories found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Subcategory Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter subcategory name"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="formData.categoryId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Select a category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">{{ errors.categoryId }}</p>
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : (editingSubcategory ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { subcategoryAPI, categoryAPI } from '../../services/api';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  Category?: Category;
  createdAt: string;
}

const subcategories = ref<Subcategory[]>([]);
const categories = ref<Category[]>([]);
const showModal = ref(false);
const editingSubcategory = ref<Subcategory | null>(null);
const loading = ref(false);
const errors = ref<Record<string, string>>({});

const formData = ref({
  name: '',
  categoryId: '' as number | string,
});

const fetchSubcategories = async () => {
  try {
    const response = await subcategoryAPI.getAll();
    subcategories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
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

const openModal = (subcategory?: Subcategory) => {
  if (subcategory) {
    editingSubcategory.value = subcategory;
    formData.value.name = subcategory.name;
    formData.value.categoryId = subcategory.categoryId;
  } else {
    editingSubcategory.value = null;
    formData.value.name = '';
    formData.value.categoryId = '';
  }
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingSubcategory.value = null;
  formData.value.name = '';
  formData.value.categoryId = '';
  errors.value = {};
};

const handleSubmit = async () => {
  errors.value = {};
  
  if (!formData.value.name || formData.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    return;
  }

  if (!formData.value.categoryId) {
    errors.value.categoryId = 'Please select a category';
    return;
  }

  loading.value = true;
  try {
    const data = {
      name: formData.value.name,
      categoryId: Number(formData.value.categoryId),
    };
    
    if (editingSubcategory.value) {
      await subcategoryAPI.update(editingSubcategory.value.id, data);
    } else {
      await subcategoryAPI.create(data);
    }
    await fetchSubcategories();
    closeModal();
  } catch (error: any) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
    } else {
      console.error('Failed to save subcategory:', error);
    }
  } finally {
    loading.value = false;
  }
};

const deleteSubcategory = async (id: number) => {
  if (!confirm('Are you sure you want to delete this subcategory?')) return;
  
  try {
    await subcategoryAPI.delete(id);
    await fetchSubcategories();
  } catch (error) {
    console.error('Failed to delete subcategory:', error);
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
  fetchSubcategories();
  fetchCategories();
});
</script>
