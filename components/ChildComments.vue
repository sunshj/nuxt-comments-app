<template>
  <div v-for="item in props.data" :key="item.id" v-bind="$attrs" class="flex flex-col gap-2">
    <CommentItem :data="item" />
    <ChildComments v-if="item.children?.length && item.children.length > 0" :data="item.children" />
  </div>
</template>

<script lang="ts" setup>
import type { Comment, User } from '~/server/utils/drizzle'

export type CommentItem = Comment & { user: User } & { children?: Array<TreeItem<CommentItem>> }

const props = defineProps<{
  data: CommentItem[]
}>()
</script>
