<template>
  <div class="m-a max-w-3xl flex flex-col p-2">
    <CommentInput />

    <div class="flex items-center justify-end gap-2 py-2">
      <div>排序方式：</div>

      <ElSelect v-model="sort" style="width: 150px">
        <ClientOnly>
          <ElOption label="最新" value="desc" />
          <ElOption label="最早" value="asc" />
        </ClientOnly>
      </ElSelect>
    </div>

    <div v-for="item in comments" :key="item.id" class="flex flex-col">
      <CommentItem :data="item" />
      <Comments
        v-if="item.children?.length && item.children.length > 0"
        :data="item.children"
        class="ml-5"
      />
      <ElDivider />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

useHead({
  title: 'Home'
})

const commentStore = useCommentStore()

const sort = ref<'desc' | 'asc'>('asc')

const queryParams = computed(() => ({
  treeify: true,
  sort: sort.value
}))

const { data: comments } = useFetch<CommentItem[]>('/api/comments', {
  query: queryParams,
  watch: [() => commentStore.refreshCount, sort]
})
</script>
