import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const token = ref(localStorage.getItem('token'))
  
  const getStoredUser = (): User | null => {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  const user = ref<User | null>(token.value ? getStoredUser() : null)

  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isChef = computed(() => userRole.value === 'chef')

  function setAuth(data: { token: string, user: User }) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    token.value = data.token
    user.value = data.user
  }

  async function login(email: string, password: string) {
    const { data } = await authAPI.login(email, password)
    setAuth(data)
    const rolePath = data.user.role === 'admin' ? '/admin/dashboard' : '/chef/dashboard'
    await router.push(rolePath)
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await authAPI.register(name, email, password)
    setAuth(data)
    await router.push('/chef/dashboard')
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    token.value = null
    user.value = null
    router.push('/login')
  }

  return { token, user, isLoggedIn, isAdmin, isChef, login, register, logout, setAuth }
})
