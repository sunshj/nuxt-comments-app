<template>
  <ElSelect
    v-model="store.loggedInUser"
    value-key="id"
    placeholder="Select User"
    style="width: 200px"
  >
    <ElOption v-for="item in props.data" :key="item.id" :label="item.name" :value="item" />
  </ElSelect>
</template>

<script lang="ts" setup>
import type { User } from '~/server/utils/drizzle'

const props = defineProps<{
  data: User[]
}>()
</script>
