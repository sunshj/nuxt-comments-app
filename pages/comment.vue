<template>
  <div class="flex flex-col gap-4">
    <div class="text-xl text-black font-bold">loggedInUser: {{ store.loggedInUser?.name }}</div>
    <CommentInput />

    <!-- <ChildComments :data="comments!" /> -->
    <!-- 只渲染两层 -->
    <div v-for="item in comments" :key="item.id" class="flex flex-col gap-2">
      <CommentItem :data="item" />
      <ChildComments
        v-if="item.children?.length && item.children.length > 0"
        :data="item.children"
        class="ml-4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~/components/ChildComments.vue'

const { data: comments } = await useFetch<CommentItem[]>('/api/comments', {
  watch: [() => store.refreshCount]
})
</script>
