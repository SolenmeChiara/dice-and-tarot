<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean,
  toggleTheme: Function
})
</script>

<template>
  <div :class="[
    'fixed top-0 left-0 right-0 z-40 shadow-sm border-b transition-colors duration-300',
    isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
  ]">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between">
        <!-- 左侧标题 -->
        <div class="flex items-center gap-2">
          <Icon icon="mdi:puzzle" class="text-lg" style="color: #4d9fff" />
          <span :class="[
            'text-lg font-semibold transition-colors',
            isDarkMode ? 'text-white' : 'text-gray-800'
          ]">MoFox-Bot 插件仓库</span>
        </div>
        
        <!-- 右侧按钮组 -->
        <div class="flex items-center gap-2">
          <!-- 主题切换按钮 -->
          <button 
            @click="toggleTheme"
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105',
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            ]"
            :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
          >
            <Icon :icon="isDarkMode ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'" class="text-lg" />
          </button>
          
          <!-- GitHub链接 -->
          <a 
            href="https://github.com/MoFox-Studio/MoFox-Plugin-Repo" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105',
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            ]"
            title="查看GitHub仓库"
          >
            <Icon icon="mdi:github" class="text-lg" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>