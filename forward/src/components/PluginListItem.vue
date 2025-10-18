<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean,
  plugin: Object,
  index: Number,
  showPlugins: Boolean,
  showPluginDetails: Function,
  openDownloadModal: Function,
  goToRepository: Function
})
</script>

<template>
  <div
    @click="showPluginDetails(plugin)"
    :class="[
      'plugin-list-item group rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border cursor-pointer',
      isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-100',
      { 'animate-list-sweep': showPlugins }
    ]"
    :style="{
      '--sweep-delay': `${index * 0.1}s`
    }"
  >
    <div class="flex items-center gap-6">
      <!-- 插件图标 -->
      <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon :icon="plugin.icon" class="text-2xl text-white" />
      </div>
      
      <!-- 插件信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 pr-4">
            <h3 :class="[
              'text-xl font-bold group-hover:text-blue-600 transition-colors mb-1',
              isDarkMode ? 'text-white' : 'text-gray-800'
            ]">{{ plugin.name }}</h3>
            <p :class="[
              'text-sm mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            ]">作者：{{ plugin.author }}</p>
            <p :class="[
              'line-clamp-2 mb-3',
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            ]">{{ plugin.description }}</p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
              <div
                v-for="tag in plugin.tags.slice(0, 4)"
                :key="tag"
                :class="[
                  'px-2 py-1 rounded-md text-xs font-medium',
                  isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-600'
                ]"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          
          <!-- 右侧信息和按钮 -->
          <div class="flex flex-col items-end gap-3 flex-shrink-0">
            <!-- 操作按钮 -->
            <div class="flex items-center gap-2">
               <button
                 @click.stop="openDownloadModal(plugin)"
                 class="px-5 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm bg-gradient-to-r from-green-500 to-cyan-600 text-white cursor-pointer"
               >
                 <Icon icon="mdi:download" class="inline mr-1" />
                 下载
               </button>
               <button
                 @click.stop="goToRepository(plugin)"
                 :disabled="!plugin.repositoryUrl || plugin.repositoryUrl.trim() === ''"
                 :class="[
                   'px-5 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm',
                   plugin.repositoryUrl && plugin.repositoryUrl.trim() !== ''
                     ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer'
                     : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                 ]"
                 :style="plugin.repositoryUrl && plugin.repositoryUrl.trim() !== '' ? 'background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%)' : ''"
               >
                 <Icon icon="mdi:github" class="inline mr-1" />
                 仓库
               </button>
             </div>
            <!-- 版本 -->
            <div class="text-right">
              <div :class="[
                'px-3 py-1 rounded-lg text-sm font-medium mb-2',
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              ]">v{{ plugin.version }}</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>