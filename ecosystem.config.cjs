require('dotenv/config')

module.exports = {
  apps: [
    {
      name: 'NuxtCommentsApp',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_type: 'json',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    }
  ]
}
