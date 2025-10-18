<script setup>
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import PluginCard from './PluginCard.vue'
import PluginListItem from './PluginListItem.vue'

const props = defineProps({
  isDarkMode: Boolean,
  isLoading: Boolean,
  loadingStatus: String,
  error: String,
  plugins: Array,
  paginatedPlugins: Array,
  filteredPlugins: Array,
  showPlugins: Boolean,
  fetchPlugins: Function,
  showPluginDetails: Function,
  openDownloadModal: Function,
  goToRepository: Function
})

const viewMode = ref('grid')

const switchViewMode = async (mode) => {
  if (mode === viewMode.value) return
  
  // This is a local ref for animation, might need to lift state up if it needs to be controlled from App.vue
  // For now, let's assume it's managed here.
  const internalShowPlugins = ref(props.showPlugins)
  internalShowPlugins.value = false
  viewMode.value = mode
  
  await nextTick()
  setTimeout(() => {
    internalShowPlugins.value = true
  }, 50)
}
</script>

<template>
  <section>
    <div class="flex justify-between items-center mb-6">
      <h2 :class="[
        'text-3xl font-bold text-left',
        isDarkMode ? 'text-white' : 'text-gray-800'
      ]">全部插件</h2>
      
      <div class="flex items-center gap-4">
        <div :class="[
          'inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors',
          isDarkMode
            ? 'bg-gray-800 border-gray-600 text-gray-300'
            : 'bg-white border-gray-200 text-gray-600'
        ]">
          <Icon icon="mdi:package-variant" class="text-lg" />
          <span class="font-medium">
            共找到 <span :class="[
              'font-bold text-lg',
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            ]">{{ filteredPlugins.length }}</span> 个插件
          </span>
        </div>

        <div :class="[
          'rounded-xl shadow-md p-1 flex transition-colors',
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        ]">
          <button
            @click="switchViewMode('grid')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            ]"
          >
            <Icon icon="mdi:view-grid" />
            卡片
          </button>
          <button
            @click="switchViewMode('list')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
              viewMode === 'list'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            ]"
          >
            <Icon icon="mdi:view-list" />
            列表
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p :class="['transition-colors text-lg font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
          {{ loadingStatus }}
        </p>
      </div>
    </div>
    
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center">
        <Icon icon="mdi:alert-circle" class="text-6xl text-red-500 mb-4" />
        <p :class="['text-lg mb-4 transition-colors', isDarkMode ? 'text-gray-300' : 'text-gray-600']">{{ error }}</p>
        <button
          @click="fetchPlugins"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          重试
        </button>
      </div>
    </div>
    
    <div v-else-if="!error && plugins.length === 0" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center">
        <Icon icon="mdi:package-variant" class="text-6xl text-gray-400 mb-4" />
        <p :class="['text-lg transition-colors', isDarkMode ? 'text-gray-300' : 'text-gray-600']">暂无插件数据</p>
      </div>
    </div>
    
    <div v-else-if="!error && viewMode === 'grid'">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative overflow-hidden">
        <PluginCard
          v-for="(plugin, index) in paginatedPlugins"
          :key="plugin.id"
          :isDarkMode="isDarkMode"
          :plugin="plugin"
          :index="index"
          :showPlugins="showPlugins"
          :showPluginDetails="showPluginDetails"
          :openDownloadModal="openDownloadModal"
          :goToRepository="goToRepository"
        />
      </div>
    </div>
    
    <div v-else-if="!error">
      <div class="space-y-4 relative overflow-hidden">
        <PluginListItem
          v-for="(plugin, index) in paginatedPlugins"
          :key="plugin.id"
          :isDarkMode="isDarkMode"
          :plugin="plugin"
          :index="index"
          :showPlugins="showPlugins"
          :showPluginDetails="showPluginDetails"
          :openDownloadModal="openDownloadModal"
          :goToRepository="goToRepository"
        />
      </div>
    </div>
  </section>
</template>