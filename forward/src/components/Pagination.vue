<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean,
  currentPage: Number,
  totalPages: Number,
  goToPage: Function
})
</script>

<template>
  <div class="flex justify-center mt-12 pb-8" v-if="totalPages > 1">
    <div class="flex gap-2">
      <button
        :class="[
          'w-10 h-10 rounded-xl border flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg',
          isDarkMode
            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300'
        ]"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <Icon icon="mdi:chevron-left" />
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all shadow-lg',
          currentPage === page
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
            : isDarkMode
              ? 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300'
        ]"
        :style="currentPage === page ? 'background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%)' : ''"
      >
        {{ page }}
      </button>
      <button
        :class="[
          'w-10 h-10 rounded-xl border flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg',
          isDarkMode
            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300'
        ]"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <Icon icon="mdi:chevron-right" />
      </button>
    </div>
  </div>
</template>