<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isDarkMode: Boolean,
  showModal: Boolean,
  selectedPlugin: Object,
  closeModal: Function,
  goToRepository: Function
})
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 毛玻璃遮罩 -->
      <div 
        class="fixed inset-0 backdrop-blur-sm"
        @click="closeModal"
      ></div>
      
      <!-- 弹窗内容 -->
      <Transition name="modal-content" appear>
        <div v-if="showModal" :class="[
          'relative rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors',
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        ]">
        
        <div v-if="selectedPlugin" class="p-8">
        <!-- 插件头部信息 -->
        <div class="flex items-start gap-6 mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon :icon="selectedPlugin.icon" class="text-3xl text-white" />
          </div>
          <div class="flex-1">
            <h2 :class="[
              'text-3xl font-bold mb-2',
              isDarkMode ? 'text-white' : 'text-gray-800'
            ]">{{ selectedPlugin.name }}</h2>
            <div class="flex items-center gap-4 mb-2">
              <p :class="[
                'text-lg',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              ]">
                <Icon icon="mdi:account" class="inline mr-1" />
                作者：{{ selectedPlugin.author }}
              </p>
              <a 
                v-if="selectedPlugin.authorUrl" 
                :href="selectedPlugin.authorUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                :class="[
                  'text-blue-500 hover:text-blue-600 transition-colors text-sm',
                  'flex items-center gap-1'
                ]"
                title="访问作者主页"
              >
                <Icon icon="mdi:open-in-new" class="text-xs" />
                主页
              </a>
            </div>
            <div :class="[
              'flex items-center gap-4 text-sm',
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            ]">
              <span>
                <Icon icon="mdi:tag" class="inline mr-1" />
                版本 {{ selectedPlugin.version }}
              </span>
              <span>
                <Icon icon="mdi:license" class="inline mr-1" />
                {{ selectedPlugin.license }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 插件描述 -->
        <div class="mb-6">
          <h3 :class="[
            'text-xl font-semibold mb-3 flex items-center gap-2',
            isDarkMode ? 'text-white' : 'text-gray-800'
          ]">
            <Icon icon="mdi:information" />
            插件描述
          </h3>
          <p :class="[
            'leading-relaxed text-base',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]">{{ selectedPlugin.description }}</p>
        </div>
        
        <!-- 分类和关键词 -->
        <div class="mb-6">
          <h3 :class="[
            'text-xl font-semibold mb-3 flex items-center gap-2',
            isDarkMode ? 'text-white' : 'text-gray-800'
          ]">
            <Icon icon="mdi:tag-multiple" />
            分类和标签
          </h3>
          <div class="space-y-3">
            <!-- 分类 -->
            <div v-if="selectedPlugin.categories && selectedPlugin.categories.length > 0">
              <p :class="[
                'text-sm font-medium mb-2',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              ]">分类：</p>
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="category in selectedPlugin.categories" 
                  :key="category"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-600'
                  ]"
                >
                  {{ category }}
                </div>
              </div>
            </div>
            <!-- 关键词 -->
            <div v-if="selectedPlugin.keywords && selectedPlugin.keywords.length > 0">
              <p :class="[
                'text-sm font-medium mb-2',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              ]">关键词：</p>
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="keyword in selectedPlugin.keywords" 
                  :key="keyword"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-600'
                  ]"
                >
                  {{ keyword }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 插件详细信息 -->
        <div class="mb-8">
          <h3 :class="[
            'text-xl font-semibold mb-3 flex items-center gap-2',
            isDarkMode ? 'text-white' : 'text-gray-800'
          ]">
            <Icon icon="mdi:cog" />
            技术信息
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div :class="[
              'rounded-xl p-4 border',
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            ]">
              <div :class="[
                'text-sm mb-1 flex items-center gap-2',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              ]">
                <Icon icon="mdi:check-circle" />
                状态
              </div>
              <div class="font-medium text-green-600 flex items-center gap-2">
                <Icon icon="mdi:check" />
                可用
              </div>
            </div>
            <div :class="[
              'rounded-xl p-4 border',
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            ]">
              <div :class="[
                'text-sm mb-1 flex items-center gap-2',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              ]">
                <Icon icon="mdi:identifier" />
                插件ID
              </div>
              <div :class="[
                'font-medium font-mono text-sm',
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              ]">{{ selectedPlugin.id }}</div>
            </div>
            <div v-if="selectedPlugin.homepageUrl" :class="[
              'rounded-xl p-4 border',
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            ]">
              <div :class="[
                'text-sm mb-1 flex items-center gap-2',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              ]">
                <Icon icon="mdi:home" />
                官方网站
              </div>
              <a 
                :href="selectedPlugin.homepageUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                访问网站
                <Icon icon="mdi:open-in-new" class="text-xs" />
              </a>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-4">
          <button 
            @click="goToRepository(selectedPlugin)"
            :disabled="!selectedPlugin.repositoryUrl || selectedPlugin.repositoryUrl.trim() === ''"
            :class="[
              'flex-1 px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
              selectedPlugin.repositoryUrl && selectedPlugin.repositoryUrl.trim() !== '' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            ]"
            :style="selectedPlugin.repositoryUrl && selectedPlugin.repositoryUrl.trim() !== '' ? 'background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%)' : ''"
            :title="selectedPlugin.repositoryUrl && selectedPlugin.repositoryUrl.trim() !== '' ? '查看仓库' : '暂无仓库链接'"
          >
            <Icon icon="mdi:github" class="inline mr-2" />
            Repo
          </button>
          <button 
            @click="closeModal"
            :class="[
              'flex-1 px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
              'bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer'
            ]"
            style="background: linear-gradient(135deg, #4d9fff 0%, #6366f1 100%)"
          >
            关闭
          </button>
        </div>
        </div>
      </div>
    </Transition>
  </div>
</Transition>
</template>