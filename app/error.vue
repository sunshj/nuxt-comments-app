<template>
  <div class="h-full flex-center flex-col gap-3 pb-20">
    <h2 class="text-3xl">Something went wrong!</h2>
    <div class="text-base text-red-600">
      {{ statusCode }} {{ statusMessage || message || error }}
    </div>

    <div v-if="statusCode === 429" class="text-base text-red-600">
      Reset Time: {{ formatTime(data.resetTime) }}
    </div>

    <ElButton type="primary" @click="$router.back()">Back</ElButton>
  </div>
</template>

<script lang="ts" setup>
import { destr } from 'destr'
import type { NuxtError } from '#app'

useServerHead({
  title: 'Error'
})

const { error } = defineProps<{ error: NuxtError<any> }>()

const { statusCode, statusMessage, message, data } = toRefs(
  reactive({
    ...error,
    data: destr<any>(error.data)
  })
)
</script>
