import { ref, computed, nextTick } from 'vue'

// --- 将状态和数据获取逻辑移到函数外部，创建单例 ---

// 数据加载状态
const isLoading = ref(true)
const loadingStatus = ref('正在从 GitHub 获取插件列表...')
const showPlugins = ref(false)
const plugins = ref([])
const error = ref(null)

// 获取插件数据
const fetchPlugins = async () => {
  // 确保只获取一次
  if (plugins.value.length > 0) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null
  try {
    loadingStatus.value = '正在从 GitHub API 获取插件列表...'
    const response = await fetch('https://api.github.com/repos/minecraft1024a/MoFox-Plugin-Repo/contents/plugin_details.json')
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - 获取插件数据失败`)
    }
    
    loadingStatus.value = '正在解析插件数据...'
    const apiResponse = await response.json()
    
    const decodedContent = decodeURIComponent(escape(atob(apiResponse.content)))
    const data = JSON.parse(decodedContent)
    
    loadingStatus.value = '正在处理插件信息...'
    plugins.value = data.map((item) => {
      const manifest = item.manifest || {} // 确保 manifest 存在
      const repositoryUrl = manifest.repository_url ||
                           manifest.repositoryUrl ||
                           manifest.repository ||
                           item.repository_url ||
                           item.repositoryUrl ||
                           item.repository ||
                           ''
      
      return {
        id: item.id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author || '未知作者',
        authorUrl: '',
        license: manifest.license || 'Unknown',
        categories: manifest.categories || [],
        keywords: manifest.keywords || [],
        repositoryUrl: repositoryUrl,
        homepageUrl: manifest.homepage_url || manifest.homepageUrl || '',
        tags: [...(manifest.categories || []), ...(manifest.keywords || [])].slice(0, 5),
        downloads: Math.floor(Math.random() * 10000) + 100,
        featured: Math.random() > 0.7,
        icon: getIconByCategory(manifest.categories?.[0] || 'other'),
        createdAt: item.createdAt
      }
    })
    
    loadingStatus.value = '加载完成！'
  } catch (err) {
    error.value = err.message
    console.error('获取插件数据失败:', err)
  } finally {
      isLoading.value = false
  }
}

// 分离插件数据获取逻辑
const fetchPluginsData = async () => {
  try {
    await fetchPlugins()
    await new Promise(resolve => setTimeout(resolve, 800))
    await nextTick()
    showPlugins.value = true
  } catch (err) {
    // 错误处理已在 fetchPlugins 中完成
  }
}

// 首次调用时自动获取数据
fetchPluginsData()

// 根据类别获取图标
const getIconByCategory = (category) => {
  const iconMap = {
    'Moderation': 'mdi:shield-check',
    'Group Management': 'mdi:account-group',
    'Admin Tools': 'mdi:tools',
    'Entertainment': 'mdi:gamepad-variant',
    'Game': 'mdi:controller-classic',
    'AI Tools': 'mdi:robot',
    'Search': 'mdi:magnify',
    'Content Retrieval': 'mdi:download',
    'Image Processing': 'mdi:image-edit',
    'Content Generation': 'mdi:creation',
    'music': 'mdi:music',
    '娱乐': 'mdi:emoticon-happy',
    '音乐': 'mdi:music-note',
    '图片': 'mdi:image',
    'API': 'mdi:api',
    '工具': 'mdi:wrench',
    '网络': 'mdi:web',
    'AI功能': 'mdi:brain',
    'Management': 'mdi:cog',
    'Expression': 'mdi:emoticon',
    'Picture': 'mdi:camera',
    '语音': 'mdi:microphone',
    '聊天增强': 'mdi:chat',
    'Developer Tools': 'mdi:code-braces',
    default: 'mdi:puzzle'
  }
  
  return iconMap[category] || iconMap.default
}

export function usePlugins() {
  // 搜索和分页状态，这些是每个组件实例独立的
  const searchQuery = ref('')
  const currentPage = ref(1)
  const sortOrder = ref('newest')
  const itemsPerPage = 12

  // 推荐插件 - 这是计算属性，依赖全局的 plugins
  const featuredPlugins = computed(() => {
    // 确保在操作前复制一份插件数组，避免修改原始数据
    const allPlugins = [...plugins.value]

    // 如果插件总数不足4个，直接返回所有插件
    if (allPlugins.length <= 4) {
      return allPlugins
    }

    // 按 createdAt 降序排序，获取最新的插件
    allPlugins.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // 获取最新的两个插件
    const newestPlugins = allPlugins.slice(0, 2)

    // 获取剩余的插件用于随机选择
    const remainingPlugins = allPlugins.slice(2)

    // 从剩余插件中随机选择两个
    const randomPlugins = []
    while (randomPlugins.length < 2 && remainingPlugins.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingPlugins.length)
      randomPlugins.push(remainingPlugins.splice(randomIndex, 1)[0])
    }

    // 合并并返回最终的插件列表
    return [...newestPlugins, ...randomPlugins]
  })

  // 过滤后的插件
  const filteredPlugins = computed(() => {
    let filtered = plugins.value.filter(plugin =>
      (plugin.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (plugin.description || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (plugin.author || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    // Sort by creation date
    if (sortOrder.value === 'newest') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder.value === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Then, sort by repository URL presence
    return filtered.sort((a, b) => {
      const aHasRepo = !!a.repositoryUrl
      const bHasRepo = !!b.repositoryUrl
      if (aHasRepo && !bHasRepo) return -1
      if (!aHasRepo && bHasRepo) return 1
      return 0
    })
  })

  // 分页后的插件
  const paginatedPlugins = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredPlugins.value.slice(start, end)
  })

  // 总页数
  const totalPages = computed(() => {
    return Math.ceil(filteredPlugins.value.length / itemsPerPage)
  })

  // 分页函数
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // 跳转到仓库
  const goToRepository = (plugin) => {
    if (plugin.repositoryUrl) {
      let url = plugin.repositoryUrl.trim()
      if (!url.startsWith('http')) {
        if (url.includes('/')) {
          url = 'https://github.com/' + url
        } else {
          alert('仓库地址格式不正确，请检查插件配置')
          return
        }
      }
      try {
        window.open(url, '_blank', 'noopener,noreferrer')
      } catch (error) {
        alert('无法打开链接，请手动复制地址：' + url)
      }
    } else {
      alert('该插件暂无仓库链接')
    }
  }

  return {
    // 组件特定状态
    searchQuery,
    currentPage,
    sortOrder,
    // 全局状态和方法
    isLoading,
    loadingStatus,
    showPlugins,
    plugins,
    error,
    fetchPluginsData,
    // 计算属性和组件特定方法
    featuredPlugins,
    filteredPlugins,
    paginatedPlugins,
    totalPages,
    goToPage,
    goToRepository
  }
}