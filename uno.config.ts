import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ important: '#__nuxt' })],
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  }
})
