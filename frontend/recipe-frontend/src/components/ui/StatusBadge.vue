<template>
  <span :class="[statusClass, sizeClass]" class="inline-flex items-center gap-1.5 rounded-full font-bold border">
    <component :is="statusIcon" :class="iconSizeClass" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Clock, FileText, CheckCircle, XCircle, AlertCircle } from '@lucide/vue'
import type { RecipeStatus } from '../../types/recipe'

const props = defineProps<{
  status: RecipeStatus
  size?: 'sm' | 'md'
}>()

const normalizedStatus = computed(() => {
  return String(props.status).toLowerCase()
})

const sizeClass = computed(() => {
  return props.size === 'sm'
    ? 'px-3 py-1.5 text-[10px] lg:text-[11px] uppercase tracking-wider'
    : 'px-3 py-1 text-xs'
})

const iconSizeClass = computed(() => {
  return props.size === 'sm' ? 'size-3' : 'size-3.5'
})

const statusClass = computed(() => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    draft: 'bg-blue-50 text-blue-700 border-blue-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200'
  }
  return classes[normalizedStatus.value] || 'bg-gray-50 text-gray-700 border-gray-200'
})

const statusIcon = computed(() => {
  const icons: Record<string, any> = {
    pending: Clock,
    draft: FileText,
    approved: CheckCircle,
    rejected: XCircle
  }
  return icons[normalizedStatus.value] || AlertCircle
})

const label = computed(() => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    draft: 'Draft',
    approved: 'Approved',
    rejected: 'Rejected'
  }
  return labels[normalizedStatus.value] || props.status
})
</script>

