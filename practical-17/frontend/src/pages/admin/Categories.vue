<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-500 mt-1">Manage product categories and subcategories</p>
      </div>
      <button
        @click="openModal()"
        class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg transition-colors cursor-pointer"
      >
        <img src ="/icons/add.svg" alt="Add Icon" class="size-5"/>
        Add Category
      </button>
    </div>

    <div v-if="dataError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-4">
      {{ dataError }}
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Parent Categories</h2>
      <div class="bg-white rounded-xl shadow-sm border border-olive-100 overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] table-fixed">
          <thead class="bg-olive-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="loading">
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            </td>
          </tr>
            <tr v-else-if="!loading && parentCategories.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">No parent categories found</td>
            </tr>

            <template v-else>
            <tr v-for="category in parentCategories" :key="category.id" class="hover:bg-olive-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-olive-500 text-white rounded-lg text-xs">Parent</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(category.createdAt || '') }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <template v-if="isCategoryOwned(category)">
                  <button
                    @click="handleEdit(category)"
                    class="text-olive-700 mr-4 cursor-pointer"
                  >
                   <img src ="/icons/edit.svg" alt="Edit Icon" class="size-4.5"/>
                  </button>
                  <button
                    @click="handleDelete(category.id)"
                    class="cursor-pointer"
                  >
                  <img src ="/icons/delete.svg" alt="Delete Icon" class="size-4.5"/>
                  </button>
                </template>
                <span v-else class="text-gray-400 text-xs">Not editable</span>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <div v-if="subcategories.length > 0">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Subcategories</h2>
      <div class="bg-white rounded-xl shadow-sm border border-olive-100 overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full min-w-[820px] table-fixed">
          <thead class="bg-olive-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
<tr v-for="category in subcategories" :key="category.id" class="hover:bg-olive-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-olive-300 text-olive-900 rounded-lg text-xs">
                  {{ getParentName(category.parent_id) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(category.createdAt || '') }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <template v-if="isCategoryOwned(category)">
                  <button
                    @click="handleEdit(category)"
                    class="text-olive-700 mr-4 cursor-pointer"
                  >
                    <img src ="/icons/edit.svg" alt="Edit Icon" class="size-4.5"/>
                  </button>
                  <button
                    @click="handleDelete(category.id)"
                    class="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                  <img src ="/icons/delete.svg" alt="Delete Icon" class="size-4.5"/>
                  </button>
                </template>
                <span v-else class="text-gray-400 text-xs">Not editable</span>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
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
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Parent Category (Optional)</label>
            <select
              v-model="formData.parent_id"
              class="w-full px-4 py-2 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none"
            >
              <option :value="null">-- No Parent (Top Level) --</option>
              <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <p v-if="errors.parent_id" class="mt-1 text-sm text-red-600">{{ errors.parent_id }}</p>
          </div>
          
          <div class="flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-olive-300 text-gray-700 rounded-lg hover:bg-olive-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-olive-500 text-white rounded-lg hover:bg-olive-600 transition-colors cursor-pointer"
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
import { ref, computed, onMounted } from 'vue';
import { categoryAPI } from '@/services';
import { useAuthStore } from '@/store/auth';
import type { Category } from '@/types';

const authStore = useAuthStore();
const currentAdminId = computed(() => authStore.user?.id);


const categories = ref<Category[]>([]);
const showModal = ref(false);
const editingCategory = ref<Category | null>(null);
const loading = ref(false);
const dataError = ref<string | null>(null);
const errors = ref<Record<string, string>>({});

const formData = ref({
  name: '',
  parent_id: null as number | null,
});

const parentCategories = computed(() => {
  return categories.value.filter(cat => !cat.parent_id);
});

const subcategories = computed(() => {
  return categories.value.filter(cat => cat.parent_id);
});

const getParentName = (parentId: number | null) => {
  if (!parentId) return 'N/A';
  const parent = categories.value.find(cat => cat.id === parentId);
  return parent?.name || 'N/A';
};

const isCategoryOwned = (category: Category) => {
  if (category.admin_id && category.admin_id === currentAdminId.value) {
    return true;
  }

  if (category.admin_id === undefined || category.admin_id === null) {
    return false; 
  }
  return false;
};

const handleEdit = (category: Category) => {
  openModal(category);
};

const handleDelete = (id: number) => {
  deleteCategory(id);
};

const fetchCategories = async () => {
  loading.value = true;
  errors.value = {};
  dataError.value = null;
  try {
    categories.value = await categoryAPI.getAll();
  } catch (error:any) {
    dataError.value = error.response?.data?.message || 'Failed to fetch categories. Please try again.';
  } finally {
    loading.value = false;
  }
};

const openModal = (category?: Category) => {
  if (category) {
    editingCategory.value = category;
    formData.value = {
      name: category.name,
      parent_id: category.parent_id,
    };
  } else {
    editingCategory.value = null;
    formData.value = {
      name: '',
      parent_id: null,
    };
  }
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCategory.value = null;
  formData.value = {
    name: '',
    parent_id: null,
  };
  errors.value = {};
};

const handleSubmit = async () => {
  errors.value = {};
  
  if (!formData.value.name || formData.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    return;
  }

  if (formData.value.parent_id) {
    const selectedAsParent = categories.value.find(c => c.id === formData.value.parent_id);
    if (selectedAsParent?.parent_id) {
      errors.value.parent_id = 'Cannot select a subcategory as parent';
      return;
    }
  }

  loading.value = true;
  try {
    const payload = {
      name: formData.value.name,
      parent_id: formData.value.parent_id,
    };

    if (editingCategory.value) {
      await categoryAPI.update(editingCategory.value.id, payload);
    } else {
      await categoryAPI.create(payload);
    }
    await fetchCategories();
    closeModal();
  } catch (error: any) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
    } else {
     dataError.value = error.response?.data?.message || 'Failed to save category. Please try again.';
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
  } catch (error:any) {
    alert(error.response?.data?.message || 'Failed to delete category. Please try again.');
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
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
