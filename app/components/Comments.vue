<template>
  <div v-for="item in props.data" :key="item.id" v-bind="$attrs" class="flex flex-col gap-2">
    <CommentItem :data="item" />
    <Comments v-if="item.children?.length && item.children.length > 0" :data="item.children" />
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

const props = defineProps<{
  data: CommentItem[]
}>()
</script>
