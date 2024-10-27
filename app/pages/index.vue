<template>
  <div class="m-a max-w-3xl flex flex-col p-2">
    <CommentReply v-if="!commentStore.replyInputVisible" />

    <div class="flex items-center justify-between gap-2 py-2">
      <div class="text-xl font-bold">{{ data?.total }} 评论</div>

      <ClientOnly>
        <ElSelect v-model="type" style="width: 150px">
          <ElOption label="按正序" value="recent" />
          <ElOption label="按倒序" value="oldest" />
          <ElOption label="按热度" value="hot" />
        </ElSelect>
        <template #fallback>
          <ElSelect disabled style="width: 150px" />
        </template>
      </ClientOnly>
    </div>

    <div v-for="item in data?.comments" :key="item.id" class="flex flex-col">
      <CommentRender :data="item" />
      <Comments v-if="item.children.length > 0" :data="item.children" class="ml-5" />
      <ElDivider />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

useServerHead({
  title: 'Home'
})

const commentStore = useCommentStore()

const type = ref<'recent' | 'oldest' | 'hot'>('recent')

const queryParams = computed(() => ({ type: type.value }))

const { data, error } = useFetch<{ comments: CommentItem[]; total: number }>('/api/comment', {
  query: queryParams,
  key: 'api-comments'
})

watch(error, val => {
  if (val) {
    ElMessage.error(val.message)
  }
})
</script>
