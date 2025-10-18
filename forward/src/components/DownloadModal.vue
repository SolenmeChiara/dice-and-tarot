<script setup>
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { marked } from 'marked'
import { usePlugins } from '../composables/usePlugins'

const { plugins } = usePlugins()

const props = defineProps({
  isDarkMode: Boolean,
  showModal: Boolean,
  plugin: Object,
  closeModal: Function
})

const branches = ref([])
const selectedBranch = ref('')
const readmeContent = ref('')
const isLoadingBranches = ref(false)
const isLoadingReadme = ref(false)
const errorBranches = ref(null)
const errorReadme = ref(null)

const pluginRepoUrl = computed(() => {
  if (!props.plugin || !props.plugin.id) return null
  // 从 usePlugins composable 获取的全局插件列表中查找
  const foundPlugin = plugins.value.find(p => p.id === props.plugin.id)
  return foundPlugin ? foundPlugin.repositoryUrl : null
})

// 获取分支
async function fetchBranches() {
  if (!pluginRepoUrl.value) {
    errorBranches.value = '未找到仓库地址。'
    readmeContent.value = '无法加载分支，因为插件数据不包含有效的仓库地址。'
    return
  }

  isLoadingBranches.value = true
  errorBranches.value = null
  branches.value = []
  readmeContent.value = ''
  selectedBranch.value = ''

  try {
    const url = new URL(pluginRepoUrl.value)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) throw new Error('无效的仓库地址')
    const [owner, repo] = pathParts.slice(-2)
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`)
    if (!response.ok) {
      throw new Error('无法获取分支列表')
    }
    const data = await response.json()
    branches.value = data
    if (branches.value.length > 0) {
      selectedBranch.value = branches.value[0].name
      await fetchReadme()
    } else {
      readmeContent.value = '该仓库没有分支。'
    }
  } catch (err) {
    errorBranches.value = err.message
    readmeContent.value = '加载分支信息失败。'
  } finally {
    isLoadingBranches.value = false
  }
}

// 获取README
async function fetchReadme() {
  if (!selectedBranch.value || !pluginRepoUrl.value) return

  isLoadingReadme.value = true
  errorReadme.value = null
  readmeContent.value = ''

  try {
    const url = new URL(pluginRepoUrl.value)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) throw new Error('无效的仓库地址')
    const [owner, repo] = pathParts.slice(-2)

    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${selectedBranch.value}/README.md`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('该分支下没有找到 README.md 文件。')
      }
      throw new Error('无法获取 README.md')
    }
    const text = await response.text()
    readmeContent.value = marked(text)
  } catch (err) {
    errorReadme.value = err.message
    readmeContent.value = err.message
    alert(`获取 README 失败: ${err.message}`)
  } finally {
    isLoadingReadme.value = false
  }
}

// 当选择的分支变化时，重新获取README
watch(selectedBranch, (newBranch, oldBranch) => {
  if (newBranch && newBranch !== oldBranch) {
    fetchReadme()
  }
})

// 当模态框显示或插件变化时，获取分支
watch(
  () => props.showModal,
  (newShowModal) => {
    // 当模态框打开时，如果插件数据已存在，则获取分支
    if (newShowModal && props.plugin) {
      fetchBranches()
    }
  }
)

watch(
  () => props.plugin,
  (newPlugin) => {
    // 当插件数据更新时，如果模态框已打开，则获取分支
    if (newPlugin && props.showModal) {
      fetchBranches()
    }
  }
)

// 下载插件
function downloadPlugin() {
  if (!pluginRepoUrl.value || !selectedBranch.value) {
    alert('缺少必要信息，无法下载。')
    return
  }
  const downloadUrl = `${pluginRepoUrl.value}/archive/refs/heads/${selectedBranch.value}.zip`
  const repoName = pluginRepoUrl.value.split('/').pop()
  
  const a = document.createElement('a')
  a.href = downloadUrl
  a.download = `${repoName}-${selectedBranch.value}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
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
          <div v-if="plugin" class="p-8">
            <!-- 插件头部信息 -->
            <div class="flex items-start gap-6 mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:download" class="text-3xl text-white" />
              </div>
              <div class="flex-1">
                <h2 :class="[
                  'text-3xl font-bold mb-2',
                  isDarkMode ? 'text-white' : 'text-gray-800'
                ]">{{ plugin.name }}</h2>
                <p :class="[
                  'text-lg',
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                ]">
                  下载插件
                </p>
              </div>
            </div>

            <!-- 分支选择 -->
            <div class="mb-6">
              <h3 :class="[
                'text-xl font-semibold mb-3 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-800'
              ]">
                <Icon icon="mdi:source-branch" />
                选择分支
              </h3>
              <div class="relative">
                <select
                  v-model="selectedBranch"
                  :disabled="isLoadingBranches || branches.length === 0"
                  :class="[
                    'w-full p-3 rounded-lg border transition-colors appearance-none',
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-800',
                    (isLoadingBranches || branches.length === 0) ? 'cursor-not-allowed opacity-50' : ''
                  ]"
                >
                  <option v-if="isLoadingBranches" value="" disabled>正在加载分支...</option>
                  <option v-else-if="errorBranches" value="" disabled>{{ errorBranches }}</option>
                  <option v-else-if="branches.length === 0" value="" disabled>没有可用的分支</option>
                  <option v-for="branch in branches" :key="branch.name" :value="branch.name">
                    {{ branch.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Icon icon="mdi:chevron-down" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'" />
                </div>
              </div>
            </div>

            <!-- README预览 -->
            <div class="mb-8">
              <h3 :class="[
                'text-xl font-semibold mb-3 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-800'
              ]">
                <Icon icon="mdi:book-open-variant" />
                README.md
              </h3>
              <div :class="[
                'prose prose-sm max-w-none p-4 rounded-lg border h-64 overflow-y-auto relative',
                isDarkMode ? 'prose-invert bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              ]">
                <div v-if="isLoadingReadme" class="absolute inset-0 flex items-center justify-center bg-opacity-50" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">
                  <p>正在加载 README...</p>
                </div>
                <div v-else-if="errorReadme" class="text-red-500">
                  <p>{{ errorReadme }}</p>
                </div>
                <div v-else-if="readmeContent" v-html="readmeContent"></div>
                <div v-else>
                  <p>没有可预览的 README 内容。</p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-4">
              <button
                @click="downloadPlugin"
                :disabled="!selectedBranch"
                :class="[
                  'flex-1 px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
                  'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
                  !selectedBranch ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                ]"
              >
                <Icon icon="mdi:download" class="inline mr-2" />
                下载
              </button>
              <button
                @click="closeModal"
                :class="[
                  'flex-1 px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
                  isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                ]"
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

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s ease-out;
}
.modal-content-leave-active {
  transition: all 0.2s ease-in;
}
.modal-content-enter-from,
.modal-content-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>