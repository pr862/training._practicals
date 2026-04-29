<template>
  <Navbar />
  <div class="min-h-screen mt-20 bg-gray-50/50 pb-12">
    <div class="max-w-7xl mx-auto px-4 pt-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
            {{ isEditMode ? 'Edit Recipe' : 'Submit New Recipe' }}
          </h1>
          <p class="text-gray-500 mt-1 text-sm lg:text-base">Share your culinary creation with the community.</p>
        </div>
        <router-link to="/chef/dashboard" class="w-fit inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
          <MoveLeft class="size-4" /> Back to Dashboard
        </router-link>
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-orange-400 rounded-full"></span> Basic Information
            </h3>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Recipe Name *</label>
                <input v-model="form.name" required type="text" placeholder="e.g. Grandma's Famous Lasagna" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none resize-none" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Short Description </label>
                <textarea v-model="form.description"  rows="3" placeholder="A brief hook about your dish..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none resize-none"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1.5">Serving Size *</label>
                  <input v-model="form.servingSize" required type="text" placeholder="e.g. 4 people" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1.5">Prep Time (min)</label>
                  <input v-model="form.preparationTime" type="number" placeholder="45" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1.5">Cooking Time</label>
                  <input v-model="form.cookingTime" type="text" placeholder="e.g. 1 hr 30 min" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none" />
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-orange-400 rounded-full"></span> Ingredients
              </h3>
              <button type="button" @click="addIngredient" class="text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                + Add Ingredient
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="(ingredient, index) in form.ingredients" :key="index" class="group flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2">
                <input v-model="ingredient.name" placeholder="Ingredient name" class="min-w-0 flex-1 px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all" required />
                <input v-model="ingredient.quantity" placeholder="Qty" class="w-16 sm:w-24 px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all" required />
                <button type="button" @click="removeIngredient(index)" class="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                  <Trash2 class="size-5" />
                </button>
              </div>
            </div>

            <p v-if="errors.ingredients" class="text-red-500 text-xs mt-2 ml-1">{{ errors.ingredients }}</p>
          </section>

          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-orange-400 rounded-full"></span> Cooking steps
            </h3>
            <QuillEditor v-model:content="form.steps" @update:content="validateField('steps')" contentType="html" theme="snow" :class="[errors.steps ? 'border-red-500' : 'border-gray-200', 'min-h-[280px] bg-white border rounded-xl']" />
            <p v-if="errors.steps" class="text-red-500 text-xs mt-2 ml-1">{{ errors.steps }}</p>
          </section>
        </div>

        <div class="space-y-6">
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Image</h3>
            <div class="mb-4">
              <div class="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button type="button" v-for="mode in (['upload', 'url'] as const)" :key="mode" @click="imageMode = mode" :class="imageMode === mode ? 'bg-white shadow-sm text-orange-600 cursor-pointer' : 'text-gray-500'" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize">
                  {{ mode }}
                </button>
              </div>
              <div class="relative group aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-orange-300">
                <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center p-4">
                  <Camera class="size-8 text-gray-300 mx-auto mb-2" />
                  <p class="text-xs text-gray-400">Click to upload image</p>
                </div>
                <input v-if="imageMode === 'upload'" type="file" @change="handleImageUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <input v-if="imageMode === 'url'" v-model="form.imageUrl" @input="imagePreview = form.imageUrl" type="url" placeholder="https://..." class="w-full mt-3 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500" />
            </div>

            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mt-8 mb-4">Video Tutorial</h3>
            <div class="relative group aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-orange-300">
              <template v-if="videoPreviewUrl">
                <video :src="videoPreviewUrl" controls class="w-full h-full object-cover"></video>
                <button type="button" @click="videoFile = null; form.video = ''" class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Trash2 class="size-4" />
                </button>
              </template>
              <template v-else>
                <div class="text-center p-4">
                  <VideoIcon class="size-8 text-gray-300 mx-auto mb-2" />
                  <p class="text-xs text-gray-400">Click to upload video</p>
                </div>
                <input type="file" @change="handleVideoUpload" accept="video/*" class="absolute inset-0 opacity-0 cursor-pointer" />
              </template>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Allergens</h3>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="a in allergensList" :key="a" :class="form.allergens.includes(a) ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-100 text-gray-500'" class="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition-all hover:border-orange-200">
                <input type="checkbox" v-model="form.allergens" :value="a" class="hidden" />
                <span class="text-xs font-medium">{{ a }}</span>
              </label>
            </div>
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mt-8 mb-4">Nutrition per serving</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-gray-400 uppercase ml-1">Calories</span>
                <input v-model="form.nutrition.calories" type="number" placeholder="0" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500" />
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-gray-400 uppercase ml-1">Protein (g)</span>
                <input v-model="form.nutrition.protein" type="number" placeholder="0" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500" />
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-gray-400 uppercase ml-1">Carbs (g)</span>
                <input v-model="form.nutrition.carbs" type="number" placeholder="0" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500" />
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-gray-400 uppercase ml-1">Fat (g)</span>
                <input v-model="form.nutrition.fat" type="number" placeholder="0" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500" />
              </div>
            </div>
          </section>

          <div class="sticky top-6 pt-2">
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
              {{ error }}
            </div>
            <button type="submit" :disabled="submitting || !isFormValid" class="w-full bg-orange-400 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 cursor-pointer">
              <span v-if="submitting" class="flex items-center justify-center gap-2">
                <Loader2 class="size-5 animate-spin" /> Processing...
              </span>
              <span v-else>{{ isEditMode ? 'Update Recipe' : 'Submit Recipe' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { recipeAPI } from '../../services/api'
import { MoveLeft, Trash2, Camera, Loader2, Video as VideoIcon } from '@lucide/vue'
import Navbar from '@/components/ui/Navbar.vue'
import { validateRequired, validateHtmlRequired, validateIngredientsList } from '@/utils/validation'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const error = ref('')
const imageMode = ref<'upload' | 'url'>('upload')
const imagePreview = ref('')
const imageFile = ref<File | null>(null)
const videoFile = ref<File | null>(null)
const editRecipeId = ref<string | null>(null)
const isEditMode = computed(() => !!editRecipeId.value)

const form = reactive({
  name: '',
  description: '',
  steps: '',
  cookingTime: '',
  ingredients: [{ name: '', quantity: '' }],
  preparationTime: '',
  imageUrl: '',
  video: '',
  allergens: [] as string[],
  nutrition: { calories: '', protein: '', carbs: '', fat: '' },
  servingSize: ''
})

const errors = reactive({
  name: '',
  servingSize: '',
  steps: '',
  ingredients: ''
})

const allergensList = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Fish', 'Soy']

const videoPreviewUrl = computed(() => {
  if (videoFile.value) return URL.createObjectURL(videoFile.value)
  return form.video || null
})

const addIngredient = () => form.ingredients.push({ name: '', quantity: '' })

const removeIngredient = (index: number) => {
  if (form.ingredients.length > 1) form.ingredients.splice(index, 1)
  validateField('ingredients')
}

const validateField = (field: string) => {
  if (field === 'name') errors.name = validateRequired(form.name, 'Recipe name')
  if (field === 'servingSize') errors.servingSize = validateRequired(form.servingSize, 'Serving size')
  if (field === 'steps') errors.steps = validateHtmlRequired(form.steps, 'Cooking steps')
  if (field === 'ingredients') errors.ingredients = validateIngredientsList(form.ingredients)
}

const isFormValid = computed(() => {
  const stepsText = form.steps.replace(/<[^>]*>/g, '').trim()
  const hasIngredients = form.ingredients.some(i => i.name.trim() && i.quantity.trim())
  return (
    form.name.trim() &&
    form.servingSize.trim() &&
    stepsText &&
    hasIngredients &&
    !Object.values(errors).some(e => e !== '')
  )
})

const setFormFromRecipe = (recipe: any) => {
  form.name = recipe.name || ''
  form.description = recipe.description || ''
  form.steps = recipe.steps || ''
  form.preparationTime = recipe.preparationTime?.toString() || ''
  form.cookingTime = recipe.cookingTime || ''
  form.servingSize = recipe.servingSize || ''
  form.video = recipe.video || ''
  form.ingredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length ? recipe.ingredients : [{ name: '', quantity: '' }]
  form.allergens = Array.isArray(recipe.allergens) ? recipe.allergens : []
  form.nutrition = {
    calories: recipe.nutrition?.calories || '',
    protein: recipe.nutrition?.protein || '',
    carbs: recipe.nutrition?.carbs || '',
    fat: recipe.nutrition?.fat || ''
  }
  form.imageUrl = recipe.image || ''
  imagePreview.value = recipe.image || ''
}

const loadEditRecipe = async (id: string) => {
  try {
    const response = await recipeAPI.details(id)
    const recipe = response.data.recipe || response.data.data
    editRecipeId.value = id
    setFormFromRecipe(recipe)
    imageMode.value = recipe.image && !recipe.image.startsWith('http') ? 'upload' : 'url'
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load recipe for editing.'
  }
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleVideoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    videoFile.value = file
    form.video = ''
  }
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  try {
    const formData = new FormData()
    const fields = ['name', 'description', 'steps', 'cookingTime', 'preparationTime', 'servingSize']
    fields.forEach(key => {
      formData.append(key, (form as any)[key])
    })

    formData.append('ingredients', JSON.stringify(form.ingredients))
    formData.append('allergens', JSON.stringify(form.allergens))
    formData.append('nutrition', JSON.stringify(form.nutrition))

    if (imageMode.value === 'upload' && imageFile.value) {
      formData.append('image', imageFile.value)
    } else if (form.imageUrl) {
      formData.append('image', form.imageUrl)
    }

    if (videoFile.value) {
      formData.append('video', videoFile.value)
    } else if (form.video) {
      formData.append('video', form.video)
    }

    if (isEditMode.value && editRecipeId.value) {
      await recipeAPI.update(editRecipeId.value, formData)
    } else {
      await recipeAPI.submit(formData)
    }
    router.push('/chef/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Submission failed. Please check your data.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const editId = (route.query.id || route.query.edit) as string | undefined
  if (editId) {
    loadEditRecipe(editId)
  }
})
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
