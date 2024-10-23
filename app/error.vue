<template>
  <div class="h-full flex-center flex-col gap-3 pb-20">
    <h2 class="text-3xl">Something went wrong!</h2>
    <div class="text-base text-red-600">{{ error?.statusCode }} {{ error?.message }}</div>
    <NuxtLink to="/">
      <ElButton type="primary">Back </ElButton>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})
</script>
