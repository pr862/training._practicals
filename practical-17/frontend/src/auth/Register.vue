<template>
  <section class="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      
      <div class="bg-white rounded-3xl shadow-xl p-10 border border-olive-100 animate-fade-in">
        
        <div class="text-center mb-8">
          <h1 class="text-4xl tracking-widest text-olive-700">
            StyleSphere
          </h1>
          <p class="text-sm text-gray-600 mt-2 tracking-wide">
            {{ isAdminRegistration ? 'Create Admin Account' : 'Create your account' }}
          </p>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">

          <div>
            <label class="block text-sm text-gray-600 mb-2 tracking-wide">
              Full Name
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-olive-300 rounded-xl focus:ring-2 focus:ring-olive-600 focus:border-olive-600 transition-all outline-none"
              :class="{ 'border-red-500': errors.name }"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2 tracking-wide">
              Email Address
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-3 border border-olive-300 rounded-xl focus:ring-2 focus:ring-olive-600 focus:border-olive-600 transition-all outline-none"
              :class="{ 'border-red-500': errors.email }"
              required
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2 tracking-wide">
              Password
            </label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="Create a password"
              class="w-full px-4 py-3 border border-olive-300 rounded-xl focus:ring-2 focus:ring-olive-600 focus:border-olive-600 transition-all outline-none"
              :class="{ 'border-red-500': errors.password }"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2 tracking-wide">
              Confirm Password
            </label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full px-4 py-3 border border-olive-300 rounded-xl focus:ring-2 focus:ring-olive-600 focus:border-olive-600 transition-all outline-none"
              :class="{ 'border-red-500': errors.confirmPassword }"
              required
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
          </div>

          <div v-if="isAdminRegistration">
            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" v-model="formData.isAdmin" class="accent-black">
              Register as Admin
            </label>
            <p class="text-xs text-gray-500 mt-1">Check this if you're creating an admin account</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-olive-600 text-white rounded-xl font-medium tracking-wide hover:bg-olive-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>

        </form>

        <div class="my-8 flex items-center">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="px-4 text-gray-400 text-sm">OR</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-olive-700 font-medium hover:underline ml-1">
            Sign In
          </router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isAdminRegistration = computed(() => route.path === '/admin/register' || route.query.admin === 'true');

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAdmin: isAdminRegistration.value,
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const validateForm = () => {
  errors.value = {};
  
  if (!formData.value.name) {
    errors.value.name = 'Name is required';
  } else if (formData.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
  } else if (formData.value.name.length > 50) {
    errors.value.name = 'Name must not exceed 50 characters';
  }
  
  if (!formData.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email';
  }
  
  if (!formData.value.password) {
    errors.value.password = 'Password is required';
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }
  
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password';
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = '';
  successMessage.value = '';
  
  let success: boolean;
  
  if (formData.value.isAdmin) {
    success = await authStore.register(
      formData.value.name,
      formData.value.email,
      formData.value.password,
    );
  } else {
    success = await authStore.registerUser(
      formData.value.name,
      formData.value.email,
      formData.value.password,
    );
  }
  
  if (success) {
    successMessage.value = 'Account created successfully! Redirecting...';
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      if (authStore.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      error.value = 'Authentication state not properly saved. Please try logging in.';
    }
  } else {
    error.value = authStore.error || 'Registration failed. Please try again.';
  }
  
  loading.value = false;
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
}
</style>
