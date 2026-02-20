<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Users</h1>
      <p class="text-gray-500 mt-1">View and manage registered users</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <span class="text-sm font-bold text-white">{{ getInitials(user.name) }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                v-if="user.role !== 'admin'"
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
              <span v-else class="text-gray-400 text-xs">Cannot delete</span>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminUserAPI } from '../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const users = ref<User[]>([]);

const fetchUsers = async () => {
  try {
    const response = await adminUserAPI.getAll();
    users.value = response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const deleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    await adminUserAPI.delete(id);
    await fetchUsers();
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchUsers();
});
</script>
