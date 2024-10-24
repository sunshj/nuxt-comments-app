// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s | Nuxt Comments App'
    }
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    typedPages: true
  },

  modules: [
    '@unocss/nuxt',
    '@element-plus/nuxt',
    '@nuxt/devtools',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils',
    '@vueuse/nuxt'
  ],

  piniaPluginPersistedstate: {
    storage: 'cookies'
  }
})
