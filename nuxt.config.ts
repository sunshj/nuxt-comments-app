// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

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
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils'
  ],

  piniaPersistedstate: {
    storage: 'cookies'
  },

  nitro: {
    routeRules: {
      '/api/comment*': { auth: true }
    }
  }
})

declare module 'nitropack' {
  interface NitroRouteConfig {
    /** Need authenticate */
    auth?: boolean
  }
}
