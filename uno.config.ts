import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ important: '#__nuxt' })],
  rules: [['justify-safe-center', { 'justify-content': 'safe center' }]],
  shortcuts: {
    'flex-center': 'flex justify-safe-center items-center'
  }
})
