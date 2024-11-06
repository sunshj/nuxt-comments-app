import { execSync } from 'node:child_process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s | Nuxt Comments'
    }
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    typedPages: true
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7 // 1 week
    },
    public: {
      repoUrl: 'https://github.com/sunshj/nuxt-comments-app',
      buildTime: Date.now(),
      gitSha: execSync('git rev-parse HEAD').toString().trim()
    }
  },

  nitro: {
    preset: 'cloudflare-pages'
  },

  modules: [
    '@unocss/nuxt',
    '@element-plus/nuxt',
    '@nuxt/devtools',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    'nuxt-security',
    '@nuxtjs/device',
    '@nuxtjs/mdc',
    '@nuxtjs/color-mode',
    'nitro-cloudflare-dev'
  ],

  colorMode: {
    classSuffix: ''
  },

  elementPlus: {
    icon: false,
    themes: ['dark']
  },

  vueuse: {
    ssrHandlers: true
  },

  mdc: {
    highlight: {
      theme: {
        default: 'github-light-default',
        dark: 'github-dark-default'
      }
    },
    headings: {
      anchorLinks: false
    },
    remarkPlugins: {
      emoji: {
        src: 'remark-emoji'
      }
    }
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    key: 'comments-%id'
  },

  security: {
    rateLimiter: {
      interval: 60 * 1000,
      headers: true,
      tokensPerInterval: 30
    },
    headers: {
      contentSecurityPolicy: {
        'img-src': false,
        'script-src': false
      }
    }
  },

  routeRules: {
    '/api/comment': {
      security: {
        xssValidator: false
      }
    },
    'api/_mdc/highlight': {
      security: {
        xssValidator: false
      }
    }
  }
})
