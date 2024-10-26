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

const sort = ref<'desc' | 'asc'>('asc')

const queryParams = computed(() => ({
  treeify: true,
  sort: sort.value
}))

const { data: comments, error } = useFetch<CommentItem[]>('/api/comment', {
  query: queryParams,
  key: 'api-comments',
  watch: [sort]
})

watch(error, val => {
  if (val) {
    ElMessage.error(val.message)
  }
})
</script>
