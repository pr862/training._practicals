<template>
  <div v-if="recipe" 
    class="group relative h-[450px] sm:h-[400px] lg:h-[450px] w-full rounded-lg sm:rounded-3xl overflow-hidden cursor-pointer shadow-xl sm:shadow-2xl" 
    @click="$emit('click', recipe)"
  >
    <img v-if="recipe.image" 
      :src="recipe.image" 
      :alt="recipe.name" 
      class="absolute inset-0 w-full h-full object-cover" 
    />
    <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center text-4xl sm:text-6xl">
      <pizza class="size-5"/>
    </div>

    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-black/70 border-t border-white/10">
      <div class="text-center">
        <h3 class="text-md sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 tracking-tight line-clamp-1">
          {{ recipe.name }}
        </h3>
        
        <div class="w-10 h-0.5 sm:w-12 sm:h-1 bg-orange-500 mx-auto mb-3 sm:mb-4 rounded-full"></div>
        
        <p class="hidden sm:line-clamp-2 text-gray-200 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 font-light">
          {{ stripHtml(recipe.description || '') }}
        </p>

       
      </div>
    </div>
  </div>

  <div v-else class="h-[350px] sm:h-[450px] w-full bg-neutral-800 animate-pulse rounded-2xl sm:rounded-3xl border border-white/5 flex flex-col justify-end p-6 sm:p-10">
    <div class="h-6 sm:h-8 bg-neutral-700 rounded w-1/2 mx-auto mb-4"></div>
    <div class="h-3 sm:h-4 bg-neutral-700 rounded w-full mb-2"></div>
    <div class="h-3 sm:h-4 bg-neutral-700 rounded w-2/3 mx-auto"></div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '../../types/recipe'
import { Pizza } from '@lucide/vue';

defineProps<{ recipe?: Recipe }>()
defineEmits<{ (e: 'click', recipe: Recipe): void }>()

const stripHtml = (html: string) => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}
</script>
