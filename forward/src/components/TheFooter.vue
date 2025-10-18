<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean
})
</script>

<template>
  <footer :class="[
    'text-white py-8 transition-colors',
    isDarkMode ? 'bg-gray-900' : 'bg-gray-800'
  ]">
    <div class="container mx-auto px-4 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <Icon icon="mdi:puzzle" class="text-2xl" style="color: #4d9fff" />
        <span class="text-lg font-bold">MoFox插件仓库</span>
      </div>
      <p class="text-gray-400 text-sm mb-4">为您的 MoFox 提供强大的插件支持</p>
      <div class="flex items-center justify-center gap-6 text-sm text-gray-400">
        <a href="https://github.com/minecraft1024a/MoFox-Plugin-Repo" target="_blank" class="hover:text-white transition-colors flex items-center gap-1">
          <Icon icon="mdi:github" />
          GitHub
        </a>
        <span>|</span>
        <span>© 2025 MoFox Plugin Repository</span>
      </div>
    </div>
  </footer>
</template>