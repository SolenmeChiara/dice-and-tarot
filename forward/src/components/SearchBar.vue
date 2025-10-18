<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean,
  searchQuery: String
})

const emit = defineEmits(['update:searchQuery'])

const updateSearchQuery = (event) => {
  emit('update:searchQuery', event.target.value)
}
</script>

<template>
  <section class="text-center mb-16">
    <h1 :class="[
      'text-5xl font-extrabold mb-4',
      isDarkMode ? 'text-white' : 'text-gray-800'
    ]">探索无限可能</h1>
    <p :class="[
      'text-xl mb-8',
      isDarkMode ? 'text-gray-300' : 'text-gray-600'
    ]">在我们的插件市场中寻找能增强您MoFox-Bot体验的工具</p>
    
    <div class="max-w-2xl mx-auto">
      <div class="relative">
        <input
          :value="searchQuery"
          @input="updateSearchQuery"
          type="text"
          placeholder="这里是搜索栏"
          :class="[
            'w-full px-5 py-4 pl-14 text-lg border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all',
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          ]"
        />
        <Icon icon="mdi:magnify" :class="[
          'absolute left-5 top-1/2 -translate-y-1/2 text-2xl',
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        ]" />
      </div>
    </div>
  </section>
</template>