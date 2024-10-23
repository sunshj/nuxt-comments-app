// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  experimental: {
    typedPages: true
  },

  modules: ['@unocss/nuxt', '@element-plus/nuxt', '@nuxt/devtools']
})
