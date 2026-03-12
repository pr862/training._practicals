<template>
  <section class="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      
      <div class="bg-white rounded-3xl shadow-xl p-10 border border-olive-100 animate-fade-in">
        
        <div class="text-center mb-8">
          <h1 class="text-4xl tracking-widest text-olive-700">
            StyleSphere
          </h1>
          <p class="text-sm text-gray-600 mt-2 tracking-wide">
            Create your account
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
              v-model.trim="formData.name"
              type="text"
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-olive-300 rounded-xl focus:ring-2 focus:ring-olive-600 focus:border-olive-600 transition-all outline-none"
              :class="{ 'border-red-500': errors.name }"
              minlength="2"
              maxlength="50"
              autocomplete="name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2 tracking-wide">
              Email Address
            </label>
            <input
              v-model.trim="formData.email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-3 border border-olive-300 rounded-xl focus:ring-2 focus:ring-olive-600 focus:border-olive-600 transition-all outline-none"
              :class="{ 'border-red-500': errors.email }"
              maxlength="100"
              autocomplete="email"
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
              minlength="8"
              maxlength="64"
              autocomplete="new-password"
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
              minlength="8"
              maxlength="64"
              autocomplete="new-password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import { normalizeEmail, normalizeName, validateRegisterForm } from '@/utils/validators';

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref<Record<string, string>>({});
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const validateForm = () => {
  errors.value = validateRegisterForm(formData.value);
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  successMessage.value = ''

  const sanitizedName = normalizeName(formData.value.name);
  const normalizedEmail = normalizeEmail(formData.value.email);

  const success = await authStore.register(
    sanitizedName,
    normalizedEmail,
    formData.value.password,
  );
  
  if (success) {
    successMessage.value = 'Account created successfully! Redirecting...'
    router.push('/admin/dashboard')
  } else {
    error.value = authStore.error || 'Registration failed. Please try again.'
  }
  
  loading.value = false;
};
</script>
