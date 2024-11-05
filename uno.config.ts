import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ important: '#__nuxt' })],
  rules: [['justify-safe-center', { 'justify-content': 'safe center' }]],
  shortcuts: {
    'flex-center': 'flex justify-safe-center items-center',
    'text-primary': 'text-gray-700 dark:text-gray-300',
    'text-secondary': 'text-gray-500 dark:text-gray-600',
    'bg-primary': 'bg-white dark:bg-dark',
    'bg-secondary': 'bg-zinc-100 dark:bg-[#0a0a0a]',
    'border-primary': 'border-gray-200 dark:border-dark'
  }
})
