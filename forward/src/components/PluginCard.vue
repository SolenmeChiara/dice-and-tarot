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
      'plugin-card group rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border cursor-pointer relative',
      isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-100',
      { 'animate-card-sweep': showPlugins }
    ]"
    :style="{
      '--sweep-delay': `${Math.floor(index / 3) * 0.15 + (index % 3) * 0.1}s`
    }"
  >
    <div class="pb-12"> <!-- 为底部按钮预留空间 -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
            <Icon :icon="plugin.icon" class="text-xl text-white" />
          </div>
          <div>
            <h3 :class="[
              'font-bold group-hover:text-blue-600 transition-colors',
              isDarkMode ? 'text-white' : 'text-gray-800'
            ]">{{ plugin.name }}</h3>
            <p :class="[
              'text-xs',
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            ]">{{ plugin.author }}</p>
          </div>
        </div>
        <div :class="[
          'px-2 py-1 rounded-lg text-xs font-medium',
          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        ]">v{{ plugin.version }}</div>
      </div>
      
      <p :class="[
        'text-sm mb-4 line-clamp-2',
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      ]">{{ plugin.description }}</p>
      
      <div class="flex flex-wrap gap-1 mb-4">
        <div
          v-for="tag in plugin.tags.slice(0, 3)"
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
    
    <!-- 按钮区域固定在右下角 -->
    <div class="absolute bottom-4 right-4 flex items-center gap-2">
      <button
        @click.stop="openDownloadModal(plugin)"
        :class="[
          'px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
          'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-pointer'
        ]"
        style="background: linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
        title="下载插件"
      >
        <Icon icon="mdi:download" class="inline mr-1" />
        下载
      </button>
      <button
        @click.stop="goToRepository(plugin)"
        :disabled="!plugin.repositoryUrl || plugin.repositoryUrl.trim() === ''"
        :class="[
          'px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
          plugin.repositoryUrl && plugin.repositoryUrl.trim() !== ''
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        ]"
        :style="plugin.repositoryUrl && plugin.repositoryUrl.trim() !== '' ? 'background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%)' : ''"
        :title="plugin.repositoryUrl && plugin.repositoryUrl.trim() !== '' ? '查看仓库' : '暂无仓库链接'"
      >
        <Icon icon="mdi:github" class="inline mr-1" />
        Repo
      </button>
    </div>
  </div>
</template>