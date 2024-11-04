<template>
  <div
    v-for="item in extendedComments"
    v-bind="$attrs"
    :key="item.id"
    class="w-full flex flex-col gap-2"
  >
    <CommentRender v-model:collapse="item.collapsed" :comment="item" />
    <div v-show="!item.collapsed">
      <CommentList v-if="item.children.length > 0" :comments="item.children" class="pl-5" />
    </div>
    <ElDivider v-if="!item.parentId" />
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

const props = defineProps<{
  comments: CommentItem[]
}>()

const extendedComments = ref<Array<CommentItem & { collapsed: boolean }>>([])

watchEffect(() => {
  extendedComments.value = props.comments.map(v => ({ ...v, collapsed: false }))
})
</script>
