<template>
  <Navbar />
  <div class="min-h-screen bg-gray-50/50">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
      
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div class="space-y-1">
          <nav class="flex mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">Chef Portal</nav>
          <h1 class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Culinary Dashboard</h1>
          <p class="text-gray-500 mt-2 text-base lg:text-lg">Refine, track, and manage your creations.</p>
        </div>
        <router-link to="/chef/submit" class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl transition-all hover:bg-orange-500 hover:ring-4 hover:ring-orange-500/20 active:scale-95 overflow-hidden">
          <span class="relative z-10">Submit New Recipe</span>
          <Plus class="size-5 relative z-10 transition-transform group-hover:rotate-90" />
        </router-link>
      </div>

      <div v-if="!loading && recipes.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-10">
        <div v-for="(val, key) in statCards" :key="key" @click="activeFilter = key === 'total' ? 'all' : key" class="cursor-pointer bg-white rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-orange-200" :class="{ 'ring-2 ring-orange-500 border-transparent': (activeFilter === key || (activeFilter === 'all' && key === 'total')) }">
          <p class="text-sm lg:text-sm font-bold text-gray-400 uppercase tracking-widest truncate">{{ val.label }}</p>
          <div class="flex items-center justify-between mt-2">
            <p class="text-xl lg:text-3xl font-black text-gray-900">{{ stats[key] }}</p>
            <div :class="['p-1.5 lg:p-2 rounded-lg shrink-0', val.color]">
              <component :is="val.icon" class="size-4 lg:size-5" />
            </div>
          </div>
        </div>
      </div>

      <Loading v-if="loading" message="Loading kitchen..." />
      <div v-else-if="filteredRecipes.length === 0" class="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-20 text-center shadow-inner">
        <div class="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText class="size-10 text-gray-300" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">
          {{ recipes.length === 0 ? "Time to share your secret ingredients with the world!" : `You don't have any recipes currently marked as ${activeFilter}.` }}
        </p>
        <router-link v-if="recipes.length === 0" to="/chef/submit" class="inline-flex items-center gap-2 text-orange-500 font-black hover:gap-4 transition-all">
          Create First Recipe <ArrowRight class="size-5" />
        </router-link>
        <button v-else @click="activeFilter = 'all'" class="text-orange-500 font-black cursor-pointer">
          Clear Filters
        </button>
      </div>

      <div v-else class="grid gap-8">
        <div v-for="recipe in filteredRecipes" :key="recipe.id" 
          class="group bg-white rounded-3xl border border-gray-100 p-3 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-orange-200">
          <div class="flex flex-col lg:flex-row gap-8 p-3">
            
            <div class="relative w-full lg:w-48 h-48  overflow-hidden bg-gray-50 shrink-0 rounded-xl border border-gray-100/50">
              <img v-if="recipe.image" :src="recipe.image" class="w-full h-full object-cover " />
              <div v-else class="w-full h-full flex flex-col items-center justify-center bg-orange-50/50 text-orange-200">
                <ChefHat class="w-14 h-14" />
              </div>
            </div>

            <div class="flex-1 flex flex-col justify-center">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {{ recipe.name }}
                  </h3>
                  <div class="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-bold text-gray-400">
                    <div class="flex items-center gap-2">
                      <Clock class="size-4 text-orange-500" />
                      <span>{{ (recipe.preparationTime || 0) }} min </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Users class="size-4 text-orange-500" />
                      <span>{{ recipe.servingSize || 'N/A' }} Servings</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Layers class="size-4 text-orange-500" />
                      <span>{{ recipe.ingredients?.length || 0 }} ingredients</span>
                    </div>
                  </div>
                </div>

                <div class="shrink-0">
                  <StatusBadge :status="recipe.status" class="px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-inset shadow-sm" />
                </div>
              </div>

              <div class="flex flex-wrap gap-3 mt-4">
                <router-link v-if="recipe.status?.toLowerCase() !== 'approved'" :to="`/chef/submit?edit=${recipe.id}`" class="px-5 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2" >
                  <Edit class="size-4" /> Edit
                </router-link>
                <router-link :to="`/chef/recipes/${recipe.id}`" class="px-5 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all flex items-center gap-2" >
                  <Eye class="size-4" /> View Details
                </router-link>
              </div>
            </div>

            <div v-if="recipe.feedback && recipe.status?.toLowerCase() !== 'approved'" class="lg:w-72 lg:border-l border-gray-100 lg:pl-8 flex flex-col justify-center">
              <button @click="toggleFeedback(recipe.id)" class="group/fb flex items-center justify-between w-full p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-lg shadow-sm">
                    <MessageSquare class="size-4 text-orange-500" />
                  </div>
                  <span class="text-sm font-bold text-gray-700">Reviewer Notes</span>
                </div>
                <ChevronDown :class="['size-4 transition-transform text-gray-400', expandedFeedback.includes(recipe.id) ? 'rotate-180' : '']" />
              </button>
            </div>
          </div>

          <div v-if="expandedFeedback.includes(recipe.id) && recipe.feedback && recipe.status?.toLowerCase() !== 'approved'" class="mt-6 animate-in slide-in-from-top-2 duration-300">
            <div :class="[getStatusProp(recipe.status, 'class'), 'p-6 rounded-2xl border-2 flex gap-4']">
              <component :is="feedbackIcon(recipe.status)" class="size-6 flex-shrink-0" />
              <div>
                <p class="font-black text-sm uppercase tracking-wider mb-1" :class="getStatusProp(recipe.status, 'titleClass')">
                  {{ getStatusProp(recipe.status, 'title') }}
                </p>
                <p class="text-gray-700 leading-relaxed font-medium">
                  {{ recipe.feedback }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { recipeAPI } from '../../services/api'
import type { Recipe } from '../../types/recipe'
import {Clock, Users, FileText, CheckCircle, XCircle, Edit, Eye, MessageSquare, ChevronDown, Plus, Layers, ArrowRight, LayoutDashboard, ChefHat} from '@lucide/vue'
import Navbar from '@/components/ui/Navbar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Loading from '@/components/ui/Loading.vue'

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const activeFilter = ref('all')
const expandedFeedback = ref<string[]>([])

const STATUS_CONFIG: Record<string, any> = {
  pending: { label: 'Reviewing', icon: Clock, color: 'bg-yellow-50 text-yellow-600', title: 'Current Status: Reviewing', class: 'bg-amber-50 border-amber-100 text-amber-900', titleClass: 'text-amber-600' },
  approved: { label: 'Live', icon: CheckCircle, color: 'bg-green-50 text-green-600', title: 'Official Endorsement', class: 'bg-emerald-50 border-emerald-100 text-emerald-900', titleClass: 'text-emerald-600' },
  rejected: { label: 'Revision', icon: XCircle, color: 'bg-red-50 text-red-600', title: 'Required Improvements', class: 'bg-rose-50 border-rose-100 text-rose-900', titleClass: 'text-rose-600' },
  draft: { label: 'Drafts', icon: Edit, color: 'bg-blue-50 text-blue-600', title: 'Pre-submission Notes', class: 'bg-blue-50 border-blue-100 text-blue-900', titleClass: 'text-blue-600' }
};

const statCards = {
  total: { label: 'All Recipes', icon: LayoutDashboard, color: 'bg-orange-50 text-orange-600' },
  ...STATUS_CONFIG
};

const stats = computed(() => {
  const initial = { total: recipes.value.length };
  return Object.keys(STATUS_CONFIG).reduce((acc, status) => {
    acc[status as keyof typeof acc] = recipes.value.filter(r => r.status?.toLowerCase() === status).length;
    return acc;
  }, initial as any);
});

const filteredRecipes = computed(() => {
  if (activeFilter.value === 'all') return recipes.value
  return recipes.value.filter(r => r.status?.toLowerCase() === activeFilter.value)
})

const toggleFeedback = (id: string) => {
  const i = expandedFeedback.value.indexOf(id);
  i > -1 ? expandedFeedback.value.splice(i, 1) : expandedFeedback.value.push(id);
};

const getStatusProp = (status: string, prop: string) => STATUS_CONFIG[status?.toLowerCase()]?.[prop] || '';
const feedbackIcon = (status: string) => STATUS_CONFIG[status?.toLowerCase()]?.icon || MessageSquare;

onMounted(async () => {
  try {
    const response = await recipeAPI.myList()
    recipes.value = response.data.recipes || response.data.data || response.data || []
  } catch (err: any) {
  } finally {
    loading.value = false
  }
})
</script>
