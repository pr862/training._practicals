<template>
  <div class="flex flex-col items-center justify-center py-20 space-y-4">
    <div class="relative size-16">
      <div class="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div class="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p v-if="message" class="text-gray-400 font-bold animate-pulse">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
</script>