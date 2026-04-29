<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
    @click.self="$emit('close')"
  >
    <div class="bg-neutral-800 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-gray-100 tracking-tight">
          {{ title }}
        </h3>
        <button 
          @click="$emit('close')" 
          class="p-2 -m-2 text-gray-300 hover:text-gray-100 rounded-xl cursor-pointer transition-all hover:bg-neutral-600"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <slot></slot>

      <div class="flex gap-3">
        <button 
          @click="$emit('close')" 
          class="flex-1 px-6 py-3 text-gray-100 font-bold border border-gray-200 rounded-xl cursor-pointer hover:bg-neutral-600 transition-all"
        >
          {{ cancelText || 'Cancel' }}
        </button>
        <button 
          @click="$emit('confirm')" 
          :disabled="loading" 
          class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:bg-orange-600 text-white font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 v-if="loading" class="size-5 animate-spin" />
          <span>{{ confirmText || 'Confirm' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Loader2} from "@lucide/vue"
defineProps<{
  isOpen: boolean
  title: string
  confirmDisabled?: boolean
  confirmText?: string
  cancelText?: string
  loading?: boolean 
}>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>
