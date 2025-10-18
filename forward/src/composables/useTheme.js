import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDarkMode = ref(false)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    // 保存主题设置到本地存储
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    updateBodyClass()
  }

  const updateBodyClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  onMounted(() => {
    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    }
    updateBodyClass()
  })

  return {
    isDarkMode,
    toggleTheme
  }
}