<template>
  <div class="min-h-screen bg-neutral-900 overflow-x-hidden">
    <Navbar/>
    
    <section class="relative min-h-[1000px] lg:min-h-[100vh] flex items-center justify-center pt-24 pb-16">
      <div class="absolute inset-0 z-0">
        <div 
          class="w-full h-full bg-[url('@/assets/home.jpg')] bg-cover bg-center "
        ></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-neutral-900/40"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
             Cook like a <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Pro </span>at home.
          </h1>
          <p class="text-sm sm:text-base lg:text-md text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-[0.2em]">
            Ditch the culinary confusion—master delicious, chef-curated dishes with guided, step-by-step expertise.
          </p>
        </div>
      </div>
    </section>

    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
         Ready-to-Cook: The Inventory
        </h2>
        <p class="mt-4 text-neutral-500 italic max-w-lg mx-auto">Explore our collection of hand-picked culinary inspirations</p>
        <div class="mt-6 w-24 h-1.5 bg-orange-500 rounded-full mx-auto"></div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="h-[450px] bg-neutral-800 animate-pulse rounded-[2.5rem]"></div>
      </div>

<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        <RecipeCard 
          v-for="recipe in recipes" 
          :key="recipe.id" 
          :recipe="recipe" 
          class="min-h-[600px] lg:min-h-[600px] flex flex-col"
          @click="$router.push({ name: 'PublicRecipeDetail', params: { id: recipe.id } })" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, } from 'vue'
import { publicRecipeAPI } from '../../services/api'
import type { Recipe } from '../../types/recipe'
import Navbar from '../../components/ui/Navbar.vue'
import RecipeCard from '@/components/ui/RecipeCard.vue'

const recipes = ref<Recipe[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    const response = await publicRecipeAPI.listApproved()
    recipes.value = response.data?.data || response.data?.recipes || response.data || []
  } catch (err) {
    console.error('API Error:', err)
  } finally {
    loading.value = false
  }
})
</script>