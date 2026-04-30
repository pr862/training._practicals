<template>
  <div class="min-h-screen bg-orange-50/30 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-[480px] bg-white shadow-2xl shadow-orange-50 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-10 border border-gray-100 my-4">
      
      <div class="text-center mb-6 sm:mb-10">
        <div class="inline-flex items-center justify-center size-14 sm:size-16 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl mb-4 shadow-lg shadow-orange-200">
          <ChefHat class="size-8 sm:w-9 sm:h-9 text-white" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">{{ title }}</h1>
        <p class="text-sm sm:text-base text-gray-500 mt-2 font-medium">{{ subtitle }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-5">
        <div v-if="mode === 'register'" class="space-y-1.5">
          <label for="name" class="text-gray-700 text-xs sm:text-sm font-bold ml-1">Full Name</label>
          <div class="relative group mt-2">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors size-5" />
            <input 
              id="name" 
              v-model="form.name" 
              :class="[errors.name ? 'border-red-500 focus:ring-red-50' : 'border-transparent focus:border-orange-400 focus:ring-orange-100', 'w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:bg-white transition-all outline-none text-sm sm:text-base']"
              placeholder="chef"
              @input="validateField('name')"
            />
          </div>
          <p v-if="errors.name" class="text-red-500 text-[10px] sm:text-xs mt-1 ml-1">{{ errors.name }}</p>
        </div>

        <div class="space-y-1.5">
          <label for="email" class="text-gray-700 text-xs sm:text-sm font-bold ml-1">Email Address</label>
          <div class="relative group mt-2">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors size-5" />
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              :class="[errors.email ? 'border-red-500 focus:ring-red-50' : 'border-transparent focus:border-orange-400 focus:ring-orange-100', 'w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:bg-white transition-all outline-none text-sm sm:text-base']"
              placeholder="chef@example.com"
              @input="validateField('email')"
            />
          </div>
          <p v-if="errors.email" class="text-red-500 text-[10px] sm:text-xs mt-1 ml-1">{{ errors.email }}</p>
        </div>

        <div class="space-y-1.5">
          <label for="password" class="text-gray-700 text-xs sm:text-sm font-bold ml-1">Password</label>
          <div class="relative group mt-2">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors size-5" />
            <input 
              id="password" 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              :class="[errors.password ? 'border-red-500 focus:ring-red-50' : 'border-transparent focus:border-orange-400 focus:ring-orange-100', 'w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3.5 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:bg-white transition-all outline-none text-sm sm:text-base']"
              placeholder="••••••••"
              @input="validateField('password')"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 p-1 cursor-pointer"
            >
              <Eye v-if="showPassword" class="size-4 sm:size-5" />
              <EyeOff v-else class="size-4 sm:size-5" />
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-[10px] sm:text-xs mt-1 ml-1">{{ errors.password }}</p>
        </div>

        <div v-if="mode === 'register'" class="space-y-1.5">
          <label for="confirmPassword" class="text-gray-700 text-xs sm:text-sm font-bold ml-1">Confirm Password</label>
          <div class="relative group mt-2">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input 
              id="confirmPassword" 
              v-model="form.confirmPassword" 
              :type="showPassword ? 'text' : 'password'" 
              :class="[errors.confirmPassword ? 'border-red-500 focus:ring-red-50' : 'border-transparent focus:border-orange-400 focus:ring-orange-100', 'w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:bg-white transition-all outline-none text-sm sm:text-base']"
              placeholder="••••••••"
              @input="validateField('confirmPassword')"
            />
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-[10px] sm:text-xs mt-1 ml-1">{{ errors.confirmPassword }}</p>
        </div>

        <p v-if="error" class="text-red-500 text-[10px] sm:text-xs mt-1 ml-1">{{ error }}</p>

        <div class="pt-2 sm:pt-4">
          <button 
            type="submit" 
            :disabled="loading || !isFormValid" 
            class="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-orange-100 cursor-pointer transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Wait a moment...' : buttonText }}
          </button>
        </div>
      </form>

      <div class="mt-6 sm:mt-8 text-center pt-6 border-t border-gray-100">
        <p class="text-xs sm:text-sm text-gray-500 font-medium">
          {{ linkText }}
          <RouterLink :to="otherModePath" class="text-orange-500 font-extrabold hover:text-orange-600 ml-1 transition-colors">
            {{ otherModeText }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ChefHat, Eye, EyeOff, Mail, Lock, User } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '@/utils/validation'

interface Props {
  mode: 'login' | 'register'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'login'
})

const emit = defineEmits<{
  (e: 'success'): void
}>()

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const title = computed(() => props.mode === 'login' ? 'Welcome Back' : 'Create Account')
const subtitle = computed(() => props.mode === 'login' ? 'Your culinary journey starts here' : 'Start your culinary journey today')
const buttonText = computed(() => props.mode === 'login' ? 'Sign in' : 'Sign Up')
const linkText = computed(() => props.mode === 'login' ? "Don't have an account?" : 'Already have an account?')
const otherModeText = computed(() => props.mode === 'login' ? 'Create Chef Account' : 'Login here')
const otherModePath = computed(() => props.mode === 'login' ? '/register' : '/login')

const validateField = (field: keyof typeof form) => {
  const validators: Record<string, () => string> = {
    name: () => validateName(form.name),
    email: () => validateEmail(form.email),
    password: () => validatePassword(form.password),
    confirmPassword: () => validateConfirmPassword(form.confirmPassword, form.password)
  };
  
  if (validators[field]) errors[field as keyof typeof errors] = validators[field]();
  if (field === 'password' && props.mode === 'register') errors.confirmPassword = validateConfirmPassword(form.confirmPassword, form.password);
}

const isFormValid = computed(() => {
  const fields = props.mode === 'register' ? ['name', 'email', 'password', 'confirmPassword'] : ['email', 'password']
  return fields.every(field => !errors[field as keyof typeof errors] && form[field as keyof typeof form])
})

watch(() => form.name, () => validateField('name'))
watch(() => form.email, () => validateField('email'))
watch(() => form.password, () => validateField('password'))
watch(() => form.confirmPassword, () => validateField('confirmPassword'))

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  error.value = ''
  success.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  
  validateField('email')
  validateField('password')
  if (props.mode === 'register') {
    validateField('name')
    validateField('confirmPassword')
  }

  if (!isFormValid.value) {
    error.value = 'Please correct the errors above.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    if (props.mode === 'login') {
      await authStore.login(form.email, form.password)
      success.value = 'Login successful! Redirecting...'
    } else {
      await authStore.register(form.name, form.email, form.password)
      success.value = 'Account created successfully! Redirecting...'
    }
    resetForm()
    emit('success')
  } catch (err: any) {
    error.value = err.response?.data?.message || `${props.mode === 'login' ? 'Login' : 'Registration'} failed.`
  } finally {
    loading.value = false
  }
}
</script>
