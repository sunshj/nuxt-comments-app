<template>
  <div class="border border-red rounded-md border-solid p-2">
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 text-sm">
        <ElAvatar size="small" class="text-gray-500">
          {{ user?.name.slice(0, 3) }}
        </ElAvatar>
        <div class="text-red-500">{{ user?.name }}</div>
        <div>#{{ id }}</div>
      </div>

      <div class="text-gray-500">
        <span v-if="parentId" class="text-blue"> 回复 #{{ parentId }}：</span>
        {{ content }}
      </div>

      <div class="flex text-sm">
        <ElButton size="small" type="primary" @click="showReplyInput">
          {{ replyInputVisible ? '收起' : '回复' }}
        </ElButton>
      </div>
    </div>
    <CommentInput v-if="replyInputVisible" :parent-id="id" class="my-2" />
  </div>
</template>

<script lang="ts" setup>
const commentStore = useCommentStore()

const props = defineProps<{
  data: CommentItem
}>()

const { id, user, content, parentId } = toRefs(props.data)

const replyInputVisible = computed(
  () => commentStore.commentInputVisible && commentStore.currentReplyId === id.value
)

function showReplyInput() {
  if (replyInputVisible.value) {
    commentStore.setCommentInputVisible(false)
  } else {
    commentStore.setCommentInputVisible(true)
    commentStore.setCurrentReplyId(id.value)
  }
}
</script>
