import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ important: '#__nuxt' })],
  rules: [['justify-safe-center', { 'justify-content': 'safe center' }]],
  shortcuts: {
    'flex-center': 'flex justify-safe-center items-center',
    'text-primary': 'text-gray-700 dark:text-gray-300',
    'text-secondary': 'text-gray-500 dark:text-gray-600',
    'bg-primary': 'bg-white dark:bg-dark',
    'bg-secondary': 'bg-#fefefe  dark:bg-#0a0a0a',
    'bg-fill': 'bg-[#8881] dark:bg-[#161618]',
    'border-primary': 'border-gray-200 dark:border-dark',
    'border-fill': 'border-[#8881] dark:border-[#161618]',
    'icon-primary': 'text-gray-300 dark:text-gray-400'
  }
})
