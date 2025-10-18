<script setup>
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { marked } from 'marked'

const props = defineProps({
  plugin: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const branches = ref([])
const selectedBranch = ref('')
const readmeContent = ref('')
const isLoadingBranches = ref(false)
const isLoadingReadme = ref(false)
const error = ref(null)

// 从仓库URL中解析出 owner 和 repo
const parseRepoUrl = (url) => {
  try {
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/)
    if (match) {
      return match[1].replace(/\.git$/, '')
    }
    // 如果不是标准的GitHub URL，尝试解析 owner/repo 格式
    if (!url.startsWith('http') && url.includes('/')) {
      return url
    }
    return null
  } catch (e) {
    return null
  }
}

const repoPath = ref(parseRepoUrl(props.plugin?.repositoryUrl || ''))

// 获取分支
const fetchBranches = async () => {
  if (!repoPath.value) {
    error.value = '无效的仓库地址。'
    return
  }
  isLoadingBranches.value = true
  error.value = null
  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath.value}/branches`)
    if (!response.ok) {
      throw new Error('获取分支列表失败。')
    }
    const data = await response.json()
    branches.value = data.map(branch => branch.name)
    if (branches.value.length > 0) {
      // 优先选择 main 或 master 作为默认分支
      if (branches.value.includes('main')) {
        selectedBranch.value = 'main'
      } else if (branches.value.includes('master')) {
        selectedBranch.value = 'master'
      } else {
        selectedBranch.value = branches.value[0]
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoadingBranches.value = false
  }
}

// 获取README
const fetchReadme = async () => {
  if (!selectedBranch.value || !repoPath.value) return
  isLoadingReadme.value = true
  readmeContent.value = ''
  error.value = null
  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath.value}/readme?ref=${selectedBranch.value}`)
    if (response.status === 404) {
      readmeContent.value = '在这个分支中没有找到 README.md 文件。'
      return
    }
    if (!response.ok) {
      throw new Error('获取 README 失败。')
    }
    const data = await response.json()
    const decodedContent = decodeURIComponent(escape(atob(data.content)))
    readmeContent.value = marked(decodedContent)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoadingReadme.value = false
  }
}

// 下载插件
const downloadPlugin = () => {
  if (!selectedBranch.value || !repoPath.value) return
  const downloadUrl = `https://github.com/${repoPath.value}/archive/refs/heads/${selectedBranch.value}.zip`
  window.open(downloadUrl, '_blank')
}

// 当选择的分支变化时，重新获取README
watch(selectedBranch, fetchReadme)

// 当弹窗显示时，获取分支信息
watch(() => props.show, (newVal) => {
  if (newVal) {
    repoPath.value = parseRepoUrl(props.plugin?.repositoryUrl || '')
    fetchBranches()
  } else {
    // 重置状态
    branches.value = []
    selectedBranch.value = ''
    readmeContent.value = ''
    error.value = null
  }
})

onMounted(() => {
  if (props.show) {
    repoPath.value = parseRepoUrl(props.plugin?.repositoryUrl || '')
    fetchBranches()
  }
})
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <Transition name="modal-content" appear>
        <div v-if="show" :class="[
          'relative rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col',
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        ]">
          
          <!-- Header -->
          <div class="p-6 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:download" />
              下载插件: {{ plugin.name }}
            </h2>
          </div>
          
          <!-- Body -->
          <div class="p-6 flex-1 overflow-y-auto">
            <!-- Branch Selector -->
            <div class="mb-4">
              <label class="font-semibold mb-2 block">选择分支:</label>
              <div class="flex items-center gap-2">
                <select v-model="selectedBranch" :disabled="isLoadingBranches" :class="[
                  'w-full p-2 border rounded-lg',
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                ]">
                  <option v-if="isLoadingBranches" value="">正在加载分支...</option>
                  <option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
                </select>
              </div>
            </div>

            <!-- README Preview -->
            <div>
              <h3 class="font-semibold mb-2 text-lg">README.md 预览</h3>
              <div :class="[
                'p-4 border rounded-lg max-h-96 overflow-y-auto prose',
                isDarkMode ? 'border-gray-700 bg-gray-900 prose-invert' : 'border-gray-200 bg-gray-50'
              ]">
                <div v-if="isLoadingReadme" class="flex justify-center items-center p-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div v-else-if="error" class="text-red-500">{{ error }}</div>
                <div v-else v-html="readmeContent"></div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="p-6 border-t flex justify-end gap-4" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button @click="$emit('close')" :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            ]">
              取消
            </button>
            <button @click="downloadPlugin" :disabled="!selectedBranch" :class="[
              'px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105',
              !selectedBranch ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600'
            ]">
              <Icon icon="mdi:download" class="inline mr-1" />
              下载 Zip
            </button>
          </div>
          
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.prose {
  max-width: none;
}
</style>