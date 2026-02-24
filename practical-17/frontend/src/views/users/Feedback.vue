<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-semibold text-olive-900 mb-6">Send Feedback</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="subject" class="block text-sm font-medium text-olive-700 mb-2">
            Subject
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            required
            class="w-full px-4 py-3 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-colors"
            placeholder="Brief description of your reviews"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-olive-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="6"
            class="w-full px-4 py-3 border border-olive-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-colors resize-none"
            placeholder="Tell us more about your reviews, suggestions, or issues..."
          ></textarea>
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 text-green-600 p-4 rounded-lg text-sm">
          {{ success }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-6 bg-olive-800 text-white font-medium rounded-lg hover:bg-olive-900 focus:ring-4 focus:ring-olive-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading">Sending...</span>
          <span v-else>Send reviews</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { userAPI } from '../../services/api';

const loading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  subject: '',
  message: '',
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await userAPI.sendFeedback({
      subject: form.subject,
      message: form.message,
    });
    
    success.value = 'Feedback sent successfully! Thank you for your reviews.';
    form.subject = '';
    form.message = '';
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to send reviews. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

