<template>
  <div class="m-a max-w-3xl w-full flex flex-col p-2">
    <CommentReply v-if="!commentStore.replyInputVisible" />

    <div class="flex items-center justify-between gap-2 py-2">
      <div class="text-xl font-bold">{{ data?.total }} 评论</div>

      <div v-if="status === 'pending'">评论加载中...</div>

      <ClientOnly>
        <ElSelect v-model="type" style="width: 100px">
          <ElOption label="按正序" value="recent" />
          <ElOption label="按倒序" value="oldest" />
          <ElOption label="按热度" value="hot" />
        </ElSelect>
        <template #fallback>
          <ElSelect style="width: 100px" />
        </template>
      </ClientOnly>
    </div>

    <div v-if="error">
      <ElEmpty description="加载失败">
        <ElButton type="primary" @click="refresh()"> Try again </ElButton>
      </ElEmpty>
    </div>

    <ElEmpty v-else-if="!data?.comments.length" description="暂无评论" />

    <CommentList v-else :comments="data.comments" />
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

useServerHead({
  title: 'Home'
})

const route = useRoute()
const commentStore = useCommentStore()

const type = ref<'recent' | 'oldest' | 'hot'>('recent')

const queryParams = computed(() => ({ type: type.value, url: route.path }))

const { data, error, status, refresh } = useFetch<{ comments: CommentItem[]; total: number }>(
  '/api/comment',
  {
    query: queryParams,
    key: 'api-comments'
  }
)

whenever(error, () => {
  toastFetchError(error.value!)
})

const focused = useWindowFocus()
whenever(focused, () => refresh())
</script>
