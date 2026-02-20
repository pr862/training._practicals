<template>
  <section class="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      
      <div class="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 animate-fade-in">
        
        <div class="text-center mb-8">
          <h1 class="text-4xl font-light tracking-widest text-gray-900">
            StyleSphere
          </h1>
          <p class="text-sm text-gray-500 mt-2 tracking-wide">
            Welcome back to your style
          </p>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">

          <div>
            <label class="block text-sm text-gray-600 mb-2 tracking-wide">
              Email Address
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
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
              placeholder="Enter your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
              :class="{ 'border-red-500': errors.password }"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" class="accent-black">
              <span>Remember me</span>
            </label>

            <a href="#" class="text-gray-900 hover:underline font-medium">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-black text-white rounded-xl font-medium tracking-wide hover:bg-gray-900 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

        </form>

        <div class="my-8 flex items-center">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="px-4 text-gray-400 text-sm">OR</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <p class="text-center text-sm text-gray-600">
          New to StyleSphere?
          <router-link to="/register" class="text-black font-medium hover:underline ml-1">
            Create an Account
          </router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: '',
  password: '',
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);
const error = ref('');

const validateForm = () => {
  errors.value = {};
  
  if (!formData.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email';
  }
  
  if (!formData.value.password) {
    errors.value.password = 'Password is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = '';
  
  const success = await authStore.login(formData.value.email, formData.value.password);
  
  if (success) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      router.push('/admin/dashboard');
    } else {
      error.value = 'Authentication state not properly saved. Please try again.';
    }
  } else {
    error.value = authStore.error || 'Login failed. Please try again.';
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
