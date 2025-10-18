<script setup>
import { onMounted } from 'vue'
import { usePlugins } from './composables/usePlugins'
import { useTheme } from './composables/useTheme'
import { useModal } from './composables/useModal'

import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import SearchBar from './components/SearchBar.vue'
import FeaturedPlugins from './components/FeaturedPlugins.vue'
import PluginList from './components/PluginList.vue'
import Pagination from './components/Pagination.vue'
import PluginDetailsModal from './components/PluginDetailsModal.vue'
import DownloadModal from './components/DownloadModal.vue'
import NoticeModal from './components/NoticeModal.vue'

const {
  searchQuery,
  currentPage,
  isLoading,
  loadingStatus,
  showPlugins,
  plugins,
  error,
  fetchPluginsData,
  featuredPlugins,
  filteredPlugins,
  paginatedPlugins,
  totalPages,
  goToPage,
  goToRepository
} = usePlugins()

const { isDarkMode, toggleTheme } = useTheme()

const {
  showModal,
  selectedPlugin,
  showPluginDetails,
  closeModal,
  showDownloadModal,
  selectedDownloadPlugin,
  openDownloadModal,
  showNotice,
  canCloseNotice,
  dontShowNoticeAgain,
  closeNotice
} = useModal()

onMounted(() => {
  fetchPluginsData()
})
</script>

<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    isDarkMode 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
  ]">
    <TheHeader :isDarkMode="isDarkMode" :toggleTheme="toggleTheme" />

    <main class="pt-20 pb-8">
      <div class="container mx-auto px-4">
        <SearchBar :isDarkMode="isDarkMode" v-model:searchQuery="searchQuery" />
        <FeaturedPlugins 
          :isDarkMode="isDarkMode" 
          :featuredPlugins="featuredPlugins"
          :showPluginDetails="showPluginDetails"
          :openDownloadModal="openDownloadModal"
          :goToRepository="goToRepository"
        />
       <PluginList
         :isDarkMode="isDarkMode"
          :isLoading="isLoading"
          :loadingStatus="loadingStatus"
          :error="error"
          :plugins="plugins"
          :paginatedPlugins="paginatedPlugins"
          :filteredPlugins="filteredPlugins"
          :showPlugins="showPlugins"
          :fetchPlugins="fetchPluginsData"
          :showPluginDetails="showPluginDetails"
          :openDownloadModal="openDownloadModal"
          :goToRepository="goToRepository"
        />
       <Pagination
         :isDarkMode="isDarkMode"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :goToPage="goToPage"
        />
      </div>
    </main>

    <TheFooter :isDarkMode="isDarkMode" />

    <PluginDetailsModal
      :isDarkMode="isDarkMode"
      :showModal="showModal"
      :selectedPlugin="selectedPlugin"
      :closeModal="closeModal"
      :goToRepository="goToRepository"
    />

    <DownloadModal
      :isDarkMode="isDarkMode"
      :showModal="showDownloadModal"
      :plugin="selectedDownloadPlugin"
      :closeModal="() => showDownloadModal = false"
    />

    <NoticeModal
      :isDarkMode="isDarkMode"
      :showNotice="showNotice"
      :canCloseNotice="canCloseNotice"
      :closeNotice="closeNotice"
      v-model:dontShowNoticeAgain="dontShowNoticeAgain"
    />
  </div>
</template>

<style scoped>
/* 毛玻璃效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* 弹窗背景动画 */
.modal-backdrop-enter-active, .modal-backdrop-leave-active {
  transition: all 0.3s ease;
}

.modal-backdrop-enter-from, .modal-backdrop-leave-to {
  opacity: 0;
}

/* 弹窗内容动画 */
.modal-content-enter-active, .modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from, .modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 卡片扫描动画 */
.plugin-card {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-card-sweep {
  animation: cardSweepReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--sweep-delay);
}

@keyframes cardSweepReveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    filter: blur(3px);
  }
  50% {
    opacity: 0.6;
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* 列表扫描动画 */
.plugin-list-item {
  opacity: 0;
  transform: translateX(-50px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-list-sweep {
  animation: listSweepReveal 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--sweep-delay);
}

@keyframes listSweepReveal {
  0% {
    opacity: 0;
    transform: translateX(-50px) scale(0.95);
    filter: blur(2px);
  }
  60% {
    opacity: 0.8;
    filter: blur(0.5px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
  }
}

/* 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 按钮悬停效果 */
.btn-gradient {
  background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%);
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(77, 159, 255, 0.3);
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* 渐变文本 */
.gradient-text {
  background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

/* 背景动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
