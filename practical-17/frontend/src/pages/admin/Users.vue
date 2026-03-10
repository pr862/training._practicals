<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
      <p class="text-gray-500 mt-1">View and manage registered users</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-olive-100 overflow-hidden">
      <div class="overflow-x-auto">
      <table class="w-full min-w-[760px]">
        <thead class="bg-olive-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-olive-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="size-8 rounded-full bg-olive-500 flex items-center justify-center mr-3">
                  <span class="text-sm font-bold text-white">{{ getInitials(user.name) }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
           
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                v-if="user.role !== 'admin'"
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-900 cursor-pointer"
              >
                <img src ="/icons/delete.svg" alt="Delete Icon" class="size-4.5"/>
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">No users found</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminUserAPI } from '@/services';
import type { AdminUser } from '@/types';

const users = ref<AdminUser[]>([]);

const fetchUsers = async () => {
  try {
    users.value = await adminUserAPI.getAll();
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
