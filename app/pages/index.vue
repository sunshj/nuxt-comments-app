<template>
  <div class="m-a max-w-3xl flex flex-col gap-4 p-2">
    <div class="flex justify-end gap-2 text-xl text-black font-bold">
      <div>@{{ userSession.user.value?.name }}</div>
      <ElButton type="danger" @click="logout()"> logout </ElButton>
    </div>
    <CommentInput />

    <div v-for="item in comments" :key="item.id" class="flex flex-col gap-2">
      <CommentItem :data="item" />
      <Comments
        v-if="item.children?.length && item.children.length > 0"
        :data="item.children"
        class="ml-4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

const commentStore = useCommentStore()
const userSession = useUserSession()

const { data: comments } = await useFetch<CommentItem[]>('/api/comments', {
  watch: [() => commentStore.refreshCount]
})

async function logout() {
  await userSession.clear()
  await navigateTo('/login')
}
</script>
