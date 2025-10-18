import { ref, onMounted } from 'vue'

export function useModal() {
  // 插件详情弹窗状态
  const showModal = ref(false)
  const selectedPlugin = ref(null)

  // 下载弹窗状态
  const showDownloadModal = ref(false)
  const selectedDownloadPlugin = ref(null)

  // 注意事项弹窗状态
  const showNotice = ref(false)
  const canCloseNotice = ref(false)
  const dontShowNoticeAgain = ref(false)

  // 显示插件详情
  const showPluginDetails = (plugin) => {
    selectedPlugin.value = plugin
    showModal.value = true
    // 锁定背景滚动
    document.body.style.overflow = 'hidden'
  }

  // 关闭插件详情弹窗
  const closeModal = () => {
    showModal.value = false
    selectedPlugin.value = null
    // 恢复背景滚动
    document.body.style.overflow = ''
  }

  // 打开下载弹窗
  const openDownloadModal = (plugin) => {
    selectedDownloadPlugin.value = plugin
    showDownloadModal.value = true
    document.body.style.overflow = 'hidden'
  }

  // 关闭注意事项弹窗
  const closeNotice = () => {
    if (canCloseNotice.value) {
      showNotice.value = false
      if (dontShowNoticeAgain.value) {
        localStorage.setItem('dontShowNoticeAgain', 'true')
        console.log('设置不再显示弹窗') // 调试日志
      }
    }
  }
  
  // 调试用：重置弹窗设置
  const resetNoticeSettings = () => {
    localStorage.removeItem('dontShowNoticeAgain')
    showNotice.value = true
    canCloseNotice.value = false
    dontShowNoticeAgain.value = false
    setTimeout(() => {
      canCloseNotice.value = true
    }, 3000)
  }

  // 全局暴露重置方法用于调试
  if (typeof window !== 'undefined') {
    window.resetNoticeSettings = resetNoticeSettings
  }


  onMounted(() => {
    // 检查注意事项弹窗设置
    const savedPreference = localStorage.getItem('dontShowNoticeAgain')
    if (savedPreference !== 'true') {
      showNotice.value = true
      // 3秒后允许关闭
      setTimeout(() => {
        canCloseNotice.value = true
      }, 3000)
    }

    // 添加键盘事件监听
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (showModal.value) {
          closeModal()
        } else if (showDownloadModal.value) {
          showDownloadModal.value = false
          document.body.style.overflow = ''
        } else if (showNotice.value && canCloseNotice.value) {
          closeNotice()
        }
      }
    })
  })

  return {
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
  }
}