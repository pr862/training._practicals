<template>
  <div class="min-h-screen bg-[#050505] text-neutral-100 selection:bg-orange-500/30 font-sans antialiased">
    
    <nav class="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <RouterLink :to="backLink" class="group flex items-center gap-3 text-neutral-400 hover:text-white transition-all">
          <div class="p-2 rounded-full group-hover:bg-white/5 transition-colors">
            <MoveLeft class="size-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span class="font-bold text-sm uppercase tracking-widest">Back to {{ backLabel }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8 lg:py-20">
      <Loading v-if="loading" />

      <div v-else-if="error || !recipe" class="max-w-md mx-auto text-center py-20 bg-neutral-900/50 rounded-[2.5rem] border border-white/5 px-8 shadow-2xl">
        <div class="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle class="size-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-black">Recipe not found</h2>
        <p class="text-neutral-500 mt-3 font-medium">{{ error || 'This recipe seems to have vanished.' }}</p>
      </div>

      <div v-else class="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          <div class="lg:col-span-5 xl:col-span-4">
            <div class="lg:sticky lg:top-28 space-y-8">
              <div class="relative group aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img :src="recipe.image" :alt="recipe.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                  <div class="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 text-center">
                    <Clock class="size-5 text-orange-400 mx-auto mb-2" />
                    <span class="block text-xl font-bold">{{ recipe.preparationTime }}m</span>
                    <span class="text-xs text-neutral-500 uppercase font-black tracking-widest">Prep Time</span>
                  </div>
                  <div class="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 text-center">
                    <Users class="size-5 text-orange-400 00 mx-auto mb-2" />
                    <span class="block text-xl font-bold">{{ recipe.servingSize }}</span>
                    <span class="text-xs text-neutral-500 uppercase font-black tracking-widest">Servings</span>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="allergen in recipe.allergens" :key="allergen" class="px-3 py-1.5 bg-orange-400/10 text-orange-400 text-[10px] font-black rounded-full border border-orange-500/20 uppercase tracking-wider">
                    {{ allergen }}
                  </span>
                </div>
              </div>
            </div>

          <div class="lg:col-span-7 xl:col-span-8 space-y-12">
            <div class="space-y-6">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                {{ recipe.name }}
              </h1>
              <p class="text-neutral-400 text-lg sm:text-xl font-medium leading-relaxed max-w-3xl">
                {{ recipe.description }}
              </p>
            </div>

            <section>
              <h3 class="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight">
                <span class="p-2 bg-orange-500/10 rounded-lg"><CheckCircle class="size-6 text-orange-500" /></span>
                Ingredients
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(item, idx) in recipe.ingredients" :key="idx" 
                  class="flex items-center gap-4 p-5 bg-neutral-900/30 border border-white/5 rounded-2xl hover:bg-neutral-800/40 hover:border-orange-500/20 transition-all group/item">
                  <div class="size-2 rounded-full bg-orange-500/40"></div>
                  <div class="flex flex-col">
                    <span class="text-neutral-200 font-medium">{{ item.name }}</span>
                    <span class="text-orange-400 text-sm font-bold">{{ item.portion || item.quantity }}</span>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="recipe.video" class="space-y-8">
              <h3 class="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight">
                <div class="p-2 bg-orange-500/10 rounded-xl">
                  <Video class="size-6 text-orange-500" />
                </div>
                Video Masterclass
              </h3>
              <div class="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl aspect-video group relative">
                <video :src="recipe.video" controls class="w-full h-full object-contain"></video>
              </div>
            </section>

            <section class="relative pl-8">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-orange-500/20 to-transparent rounded-full"></div>
              <h3 class="text-2xl font-black text-white mb-8 uppercase tracking-tight">Preparation Steps</h3>
              <div v-if="recipe.steps" 
                class="ql-editor prose prose-invert max-w-none prose-p:text-neutral-300 prose-p:leading-relaxed prose-strong:text-orange-500 text-lg" 
                v-html="recipe.steps">
              </div>
            </section>

           <section v-if="recipe.nutrition" class="bg-neutral-900 rounded-3xl lg:rounded-[2rem] p-6 sm:p-8 border border-neutral-800">
                <h3 class="text-2xl font-bold text-white mb-8 flex items-center gap-4">Nutrition Information</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div v-for="(value, key) in recipe.nutrition" :key="key" class="bg-neutral-800/50 p-4 sm:p-6 rounded-2xl border border-neutral-700/50 text-center">
                    <div class="text-neutral-500 text-xs font-black uppercase mb-1 truncate">{{ key }}</div>
                    <div class="text-xl sm:text-2xl font-bold text-white">{{ value || '0' }}</div>
                  </div>
                </div>
              </section>
            </div>
          </div>

        <div v-if="isAdmin || (isChef && hasFeedback)" class="rounded-[2rem] border overflow-hidden backdrop-blur-xl" :class="statusClasses">
          <div class="p-8 flex flex-col md:flex-row md:items-center gap-8">
            <div class="p-4 bg-white/20 rounded-[1.5rem] self-start shadow-xl">
              <MessageSquare v-if="hasFeedback" class="size-7 text-white" />
              <CheckCircle v-else class="size-7 text-white" />
            </div>
            <div class="flex-1 space-y-2">
              <h3 class="font-black text-xl tracking-tight uppercase">Status: {{ recipe.status }}</h3>
              <div v-if="hasFeedback" class="text-white/80 text-lg font-medium leading-relaxed italic" v-html="recipe.feedback"></div>
              <p v-else class="text-sm font-bold opacity-70">Published by {{ recipe.createdByEmail }} • {{ formatDate(recipe.createdAt) }}</p>
            </div>
          </div>
        </div>

        <div v-if="isAdmin || isChef" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
          <div class="bg-neutral-900/80 backdrop-blur-2xl border border-white/10 p-3 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
            <div class="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-center">
              <template v-if="isAdmin">
                <button @click="handleApprove" :disabled="processing" 
                  class="flex items-center justify-center gap-2 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest flex-1 sm:px-8 cursor-pointer">
                  <Loader2 v-if="processing" class="size-5 animate-spin" />
                  <CheckCircle v-else class="size-4" />
                  <span>Approve</span>
                </button>
                <button @click="openFeedbackModal('rejected')" 
                  class="flex items-center justify-center gap-2 h-12 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl font-black border border-rose-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex-1 sm:px-8 cursor-pointer">
                  <XCircle class="size-5" />
                  <span>Reject</span>
                </button>
              </template>
              <button v-if="isChef" @click="handleEdit" 
                :class="[isAdmin ? 'col-span-2 sm:flex-1' : 'col-span-2']"
                class="flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-2xl font-black shadow-lg shadow-orange-900/20 transition-all active:scale-95 text-sm sm:px-30 cursor-pointer">
                <Edit class="size-4" />
                <span>Edit Recipe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal :isOpen="showModal" @close="showModal = false" @confirm="submitFeedback" :confirm-text="confirmText" :title="modalTitle" class="backdrop-blur-md">
      <div class="space-y-5 py-4">
        <p class="text-sm font-bold text-neutral-400 uppercase tracking-widest">Revision Feedback</p>
        <textarea v-model="feedback" placeholder="Provide constructive notes for the chef..." 
          class="w-full p-6 border border-white/5 rounded-3xl bg-neutral-950 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-48 resize-none font-medium"></textarea>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { Recipe } from '../types/recipe'
import { Clock, Users, Loader2, CheckCircle, XCircle, Edit, MessageSquare, MoveLeft, Video } from '@lucide/vue'
import Modal from '@/components/ui/Modal.vue'
import { adminRecipeAPI, publicRecipeAPI, recipeAPI } from '../services/api'
import { formatDate } from '@/utils/format'
import Loading from '@/components/ui/Loading.vue'

const props = defineProps<{ role: 'public' | 'chef' | 'admin' }>()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const recipe = ref<Recipe | null>(null)
const error = ref('')
const processing = ref(false)
const showModal = ref(false)
const feedback = ref('')
const feedbackAction = ref<'draft' | 'rejected'>('draft')
const id = route.params.id as string

const modalTitle = computed(() => feedbackAction.value === 'rejected' ? 'Reject Recipe' : 'Request Revision')
const confirmText = computed(() => feedbackAction.value === 'rejected' ? 'Reject' : 'Send Feedback')

const api = computed(() => {
  if (props.role === 'admin') return adminRecipeAPI
  if (props.role === 'chef') return recipeAPI
  return publicRecipeAPI
})

const backLink = computed(() => {
  if (props.role === 'admin') return '/admin/dashboard'
  if (props.role === 'chef') return '/chef/dashboard'
  return '/'
})

const backLabel = computed(() => props.role === 'public' ? 'Recipes' : 'Dashboard')
const isAdmin = computed(() => props.role === 'admin')
const isChef = computed(() => props.role === 'chef')

const statusClasses = computed(() => {
  const map: Record<string, string> = {
    approved: 'border-green-500/30 bg-green-500/10 text-green-400',
    rejected: 'border-red-500/30 bg-red-500/10 text-red-400',
    draft: 'border-orange-400/30 bg-orange-400/10 text-orange-400'
  };
  return map[recipe.value?.status?.toLowerCase() || ''] || 'border-blue-500/30 bg-blue-500/10 text-blue-400';
});

onMounted(async () => {
  if (isAdmin.value && !authStore.isAdmin) return router.push('/login')
  if (isChef.value && !authStore.isChef) return router.push('/login')
  try {
    const response = await api.value.details(id)
    recipe.value = response.data.recipe || response.data.data || response.data
  } catch (err) {
    error.value = 'Could not load recipe details.'
  } finally {
    loading.value = false
  }
})

const handleApprove = async () => {
  processing.value = true
  try {
    await adminRecipeAPI.updateStatus(id, 'approved')
    router.push('/admin/dashboard')
  } catch {
    alert('Approval failed')
  } finally {
    processing.value = false
  }
}

const openFeedbackModal = (action: 'draft' | 'rejected') => {
  feedbackAction.value = action
  feedback.value = ''
  showModal.value = true
}

const submitFeedback = async () => {
  if (!feedback.value.trim()) return
  processing.value = true
  try {
    await adminRecipeAPI.updateStatus(id, feedbackAction.value, feedback.value)
    showModal.value = false
    router.push('/admin/dashboard')
  } catch {
    alert('Status update failed')
  } finally {
    processing.value = false
  }
}

const handleEdit = () => router.push(`/chef/submit?edit=${id}`)
const hasFeedback = computed(() => !!recipe.value?.feedback?.trim() && recipe.value?.status?.toLowerCase() !== 'approved')
</script>

<style scoped>
.prose :deep(img) {
  border-radius: 1.5rem;
}

.prose :deep(strong) {
  color: #ffffff;
}

.ql-editor :deep(*) {
  color: inherit !important;
}

.ql-editor :deep(ol) {
  list-style-type: decimal !important;
  padding-left: 1.5rem !important;
  margin-bottom: 1rem;
}

.ql-editor :deep(ul) {
  list-style-type: disc !important;
  padding-left: 1.5rem !important;
  margin-bottom: 1rem;
}

.ql-editor :deep(li) {
  margin-bottom: 0.5rem;
}
</style>
