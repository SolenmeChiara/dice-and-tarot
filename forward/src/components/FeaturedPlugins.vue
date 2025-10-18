<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean,
  featuredPlugins: Array,
  showPluginDetails: Function,
  openDownloadModal: Function,
  goToRepository: Function
})
</script>

<template>
  <section class="mb-16">
    <h2 :class="[
      'text-3xl font-bold mb-8 text-left',
      isDarkMode ? 'text-white' : 'text-gray-800'
    ]">今日插件</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="(plugin, index) in featuredPlugins"
        :key="`featured-${plugin.id}`"
        @click="showPluginDetails(plugin)"
        :class="[
          'featured-card group rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border cursor-pointer relative overflow-hidden',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
        ]"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Icon :icon="plugin.icon" class="text-3xl text-white" />
              </div>
              <div>
                <h3 :class="[
                  'text-xl font-bold group-hover:text-blue-600 transition-colors',
                  isDarkMode ? 'text-white' : 'text-gray-800'
                ]">{{ plugin.name }}</h3>
                <p :class="[
                  'text-sm',
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
            'text-base mb-4 line-clamp-3 flex-grow',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]">{{ plugin.description }}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <div
              v-for="tag in plugin.tags.slice(0, 4)"
              :key="tag"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-600'
              ]"
            >
              {{ tag }}
            </div>
          </div>
          
          <div class="mt-auto flex justify-end gap-2">
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
              查看仓库
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>