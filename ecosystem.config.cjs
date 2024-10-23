require('dotenv/config')

module.exports = {
  apps: [
    {
      name: 'NuxtCommentsApp',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
