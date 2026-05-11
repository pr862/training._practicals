<template>
  <Navbar w-full />
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 pt-24 lg:py-12 lg:pt-28 bg-gray-50/50 min-h-screen">
    <div class="mb-8 lg:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <nav class="flex mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">Admin Portal</nav>
        <h1 class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Recipe Management</h1>
        <p class="text-gray-500 mt-2 text-base lg:text-lg">Quality control dashboard for community submissions.</p>
      </div>
      <button @click="loadRecipes" :disabled="loading" class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-orange-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
        <RotateCcw :class="['size-5 text-orange-500', { 'animate-spin': loading }]" />
        Refresh Data
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-10">
      <div v-for="(count, key) in statusCounts" :key="key" @click="statusFilter = key" class="cursor-pointer bg-white rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-orange-200" :class="{ 'ring-2 ring-orange-500 border-transparent': statusFilter === key }">
        <p class="text-xs lg:text-sm font-bold text-gray-400 uppercase tracking-widest truncate">{{ key }}</p>
        <div class="flex items-center justify-between mt-2">
          <p class="text-xl lg:text-3xl font-black text-gray-900">{{ count }}</p>
          <div :class="['p-1.5 lg:p-2 rounded-lg shrink-0', getStatusConfig(key).color]">
            <component :is="getStatusConfig(key).icon" class="size-4 lg:w-5 lg:h-5" />
          </div>
        </div>
      </div>
    </div>

    <Loading v-if="loading" message="Syncing recipe database..." />

    <template v-else>
      <transition enter-active-class="transform transition duration-300 ease-out" enter-from-class="-translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100">
        <div v-if="selectedRecipes.length > 0" class="bg-gray-900 text-white rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl ring-4 ring-orange-500/10">
          <div class="flex items-center gap-4 lg:gap-6 pl-2">
            <span class="text-xs font-bold bg-orange-400 px-3 py-1 rounded-full text-white">{{ selectedRecipes.length }} <span class="hidden sm:inline">Selected</span></span>
            <div class="hidden sm:block h-6 w-px bg-gray-700"></div>
            <div class="flex items-center gap-4">
              <button @click="bulkAction('approved')" :disabled="bulkLoading" class="flex items-center gap-2 text-xs lg:text-sm font-bold hover:text-green-400 transition-colors disabled:opacity-50 cursor-pointer">
                <CheckCircle class="size-4" /> <span class="hidden sm:inline">Approve</span>
              </button>
              <button @click="bulkAction('rejected')" :disabled="bulkLoading" class="flex items-center gap-2 text-xs lg:text-sm font-bold hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer">
                <XCircle class="size-4" /> <span class="hidden sm:inline">Reject</span>
              </button>
            </div>
          </div>
          <button @click="clearSelection" class="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest cursor-pointer">Cancel</button>
        </div>
      </transition>

      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="filteredRecipes.length === 0" class="p-12 lg:p-20 text-center">
          <div class="bg-gray-50 size-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText class="size-8 lg:w-10 lg:h-10 text-gray-300" />
          </div>
          <h3 class="text-lg lg:text-xl font-bold text-gray-900">No results found</h3>
          <p class="text-gray-500 mt-1 text-sm">There are no recipes matching your current filter.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="border-b border-gray-100">
               
                <th class="px-6 py-5 text-xs lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Recipe Info</th>
                <th class="px-6 py-5 text-xs lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</th>
                <th class="px-6 py-5 text-xs lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Submission Date</th>
                <th class="pr-8 py-5 text-right text-xs lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="recipe in filteredRecipes" :key="recipe.id" class="group hover:bg-orange-50/20 transition-colors">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="relative shrink-0">
                      <img v-if="recipe.image" :src="recipe.image" class="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl object-cover shadow-sm ring-2 ring-white" />
                      <div v-else class="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-200 border border-orange-100">
                        <ChefHat class="size-6" />
                      </div>
                      <div v-if="recipe.feedback" class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate max-w-[180px] lg:max-w-xs">{{ recipe.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <StatusBadge :status="recipe.status" size="sm" />
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="text-xs lg:text-sm font-semibold text-gray-700">{{ formatDate(recipe.createdAt) }}</div>
                </td>
                <td class="pr-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-1 lg:gap-2">
                    <router-link :to="`/admin/recipe/${recipe.id}`" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Eye class="size-5" />
                    </router-link>
                    <template v-if="['pending', 'draft'].includes(recipe.status.toLowerCase())">
                      <button @click="quickApprove(recipe)" :disabled="actionLoading[recipe.id]" class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all disabled:opacity-30 cursor-pointer" title="Quick Approve">
                        <CheckCircle class="size-5" />
                      </button>
                      <button @click="openFeedbackModal(recipe, 'rejected')" :disabled="actionLoading[recipe.id]" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30 cursor-pointer" title="Reject">
                        <XCircle class="size-5" />
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal :isOpen="feedbackModal.isOpen" :loading="actionLoading[feedbackModal.recipe?.id || '']":title="feedbackModal.action === 'rejected' ? 'Reject Recipe' : 'Revision Feedback'" :confirm-text="feedbackModal.action === 'rejected' ? 'Reject' : 'Send Feedback' "@close="closeFeedbackModal" @confirm="submitFeedback" class="backdrop-blur-md"
      >
        <div class="space-y-5 py-4">
          <p class="text-sm font-bold text-neutral-400 uppercase tracking-widest">
            Revision Feedback
          </p>
          <textarea 
            v-model="feedbackModal.feedback" 
            :disabled="actionLoading[feedbackModal.recipe?.id || '']"
            placeholder="Provide constructive notes for the chef..." 
            class="w-full p-6 border border-white/5 rounded-3xl bg-neutral-950 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-48 resize-none font-medium"
          ></textarea>
        </div>
      </Modal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminRecipeAPI } from '../../services/api'
import type { Recipe } from '../../types/recipe'
import { Clock, CheckCircle, XCircle, FileText, Eye, RotateCcw, Edit3, LayoutDashboard, ChefHat } from '@lucide/vue'
import { formatDate } from '../../utils/format'
import Navbar from '@/components/ui/Navbar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Loading from '@/components/ui/Loading.vue'
import Modal from '@/components/ui/Modal.vue'

const loading = ref(false)
const statusFilter = ref('all')
const selectedRecipes = ref<string[]>([])
const actionLoading = ref<Record<string, boolean>>({})
const bulkLoading = ref(false)
const recipes = ref<Recipe[]>([])

const STATUS_UI: Record<string, { icon: any, color: string }> = {
  all: { icon: LayoutDashboard, color: 'bg-orange-50 text-orange-600' },
  pending: { icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
  approved: { icon: CheckCircle, color: 'bg-green-50 text-green-600' },
  rejected: { icon: XCircle, color: 'bg-red-50 text-red-600' },
  draft: { icon: Edit3, color: 'bg-blue-50 text-blue-600' }
}

const getStatusConfig = (key: string) => STATUS_UI[key.toLowerCase()] || { icon: FileText, color: 'bg-gray-50 text-gray-600' }

const feedbackModal = ref({
  isOpen: false,
  recipe: null as Recipe | null,
  action: '' as 'rejected' | 'draft' | '',
  feedback: ''
})

const filteredRecipes = computed(() => {
  if (statusFilter.value === 'all') return recipes.value
  return recipes.value.filter(r => r.status.toLowerCase() === statusFilter.value)
})

const statusCounts = computed(() => ({
  all: recipes.value.length,
  ...['pending', 'draft', 'approved', 'rejected'].reduce((acc, s) => ({
    ...acc, [s]: recipes.value.filter(r => r.status.toLowerCase() === s).length
  }), {})
}));

const clearSelection = () => { selectedRecipes.value = [] }

const quickApprove = async (recipe: Recipe) => { await updateRecipeStatus(recipe, 'approved') }

const openFeedbackModal = (recipe: Recipe, action: 'rejected' | 'draft') => {
  feedbackModal.value = { isOpen: true, recipe, action, feedback: recipe.feedback || '' }
}

const closeFeedbackModal = () => {
  feedbackModal.value.isOpen = false
  feedbackModal.value.recipe = null
}

const submitFeedback = async () => {
  if (!feedbackModal.value.recipe) return
  await updateRecipeStatus(feedbackModal.value.recipe, feedbackModal.value.action, feedbackModal.value.feedback)
  closeFeedbackModal()
}

const updateRecipeStatus = async (recipe: Recipe, status: string, feedback?: string) => {
  actionLoading.value[recipe.id] = true
  try {
    await adminRecipeAPI.updateStatus(recipe.id, status, feedback)
    const index = recipes.value.findIndex(r => r.id === recipe.id)
    if (index > -1) {
      recipes.value[index] = { ...recipes.value[index], status: status as Recipe['status'], feedback: feedback || recipes.value[index].feedback }
    }
    selectedRecipes.value = selectedRecipes.value.filter(id => id !== recipe.id)
    await loadRecipes()
  } catch (error) {
    console.error(error)
  } finally {
    actionLoading.value[recipe.id] = false
  }
}

const bulkAction = async (status: string) => {
  bulkLoading.value = true
  try {
    for (const id of [...selectedRecipes.value]) {
      const recipe = recipes.value.find(r => r.id === id)
      if (recipe) await updateRecipeStatus(recipe, status)
    }
    clearSelection()
  } finally {
    bulkLoading.value = false
  }
}

const loadRecipes = async () => {
  loading.value = true
  try {
    const response = await adminRecipeAPI.list()
    recipes.value = response.data.recipes
  } finally {
    loading.value = false
  }
}

onMounted(loadRecipes)
</script>

<style scoped>
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
