<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  isDarkMode: Boolean,
  showNotice: Boolean,
  canCloseNotice: Boolean,
  closeNotice: Function
})

const dontShowNoticeAgain = ref(false)

const handleClose = () => {
  if (dontShowNoticeAgain.value) {
    localStorage.setItem('dontShowNoticeAgain', 'true')
  }
  props.closeNotice()
}
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="showNotice" class="fixed inset-0 z-[9999] flex items-center justify-center"
         style="background-color: rgba(0, 0, 0, 0.5);">
      <div 
        class="fixed inset-0 backdrop-blur-sm"
        @click="handleClose"
      ></div>

      <Transition name="modal-content" appear>
        <div v-if="showNotice" :class="[
          'relative rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors',
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        ]">

        <div class="p-8">
          <h2 :class="[
            'text-3xl font-bold mb-6',
            isDarkMode ? 'text-white' : 'text-gray-800'
          ]">⚠️ 插件市场重要提示</h2>

          <div class="space-y-6">
            <div>
              <h3 :class="[
                'text-xl font-semibold mb-3 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-800'
              ]">
                <Icon icon="mdi:lock" /> 安全须知
              </h3>
              <p :class="[
                'leading-relaxed text-base',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              ]">所有插件均由第三方开发者独立开发，<strong>MoFox项目团队不承担任何责任</strong>。</p>
            </div>

            <div>
              <h3 :class="[
                'text-xl font-semibold mb-3 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-800'
              ]">
                <Icon icon="mdi:clipboard-text" /> 使用前必读
              </h3>
              <ul :class="[
                'list-disc pl-6 space-y-2',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              ]">
                <li>⚠️ 第三方插件可能存在安全风险：恶意代码、隐私泄露、系统崩溃</li>
                <li>⚠️ 插件质量无法保证：功能缺陷、兼容性问题、法律风险</li>
                <li>⚠️ 使用风险完全自担：MoFox团队不提供技术支持或售后服务</li>
              </ul>
            </div>

            <div>
              <h3 :class="[
                'text-xl font-semibold mb-3 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-800'
              ]">
                <Icon icon="mdi:shield-check" /> 安全建议
              </h3>
              <ul :class="[
                'list-disc pl-6 space-y-2',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              ]">
                <li>🔍 仔细评估插件来源和开发者信誉</li>
                <li>📖 详细阅读插件说明和权限要求</li>
                <li>🧪 测试环境中先试用再正式使用</li>
                <li>🚫 立即停用发现异常行为的插件</li>
              </ul>
            </div>

            <div>
              <h3 :class="[
                'text-xl font-semibold mb-3 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-800'
              ]">
                <Icon icon="mdi:phone" /> 问题处理
              </h3>
              <ul :class="[
                'list-disc pl-6 space-y-2',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              ]">
                <li>插件技术问题：请直接联系插件开发者</li>
                <li>违规举报：通过官方渠道举报恶意插件</li>
                <li>平台问题：联系MoFox-Bot官方支持</li>
              </ul>
            </div>

            <div>
              <p :class="[
                'leading-relaxed text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              ]">💡 继续使用即表示您已阅读并同意《<a href="./PLUGIN_MARKET_NOTICE.md" class="underline hover:text-blue-500 transition-colors" target="_blank">MoFox-Bot插件市场使用公告</a>》的全部条款。</p>
            </div>

            <div class="flex items-center gap-2 mt-6">
              <input 
                type="checkbox" 
                v-model="dontShowNoticeAgain" 
                :class="[
                  'w-5 h-5 rounded transition-colors',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                ]"
              />
              <label :class="[
                'text-sm',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              ]">我已知悉，下次不再提示</label>
            </div>
            
            <div class="flex justify-end mt-8">
              <button 
                @click="handleClose"
                :disabled="!canCloseNotice"
                :class="[
                  'px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200',
                  canCloseNotice
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                ]"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</Transition>
</template>