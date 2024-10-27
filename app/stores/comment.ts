import type { CommentItem } from '~~/server/utils'

export const useCommentStore = defineStore('comment', () => {
  const currentReply = ref<CommentItem>()

  function setCurrentReply(reply?: CommentItem) {
    currentReply.value = reply
  }

  const replyInputVisible = ref(false)

  function setReplyInputVisible(visible: boolean) {
    replyInputVisible.value = visible
  }

  return {
    currentReply,
    setCurrentReply,
    replyInputVisible,
    setReplyInputVisible
  }
})
