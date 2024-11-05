<template>
  <ElConfigProvider :locale>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import locale from 'element-plus/es/locale/lang/zh-cn'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-synthesis: style;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body,
#__nuxt {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
