import { defineConfig } from '@sunshj/eslint-config'

export default defineConfig([
  {
    rules: {
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: false }
      ]
    }
  },
  {
    ignores: ['migrations']
  }
])
