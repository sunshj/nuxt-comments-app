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

  async function addComment(data: Pick<CommentItem, 'url' | 'userId' | 'parentId' | 'content'>) {
    return await $fetch('/api/comment', {
      method: 'POST',
      body: data
    }).catch(error => {
      toastFetchError(error)
      return undefined
    })
  }

  async function deleteComments(ids: number[]) {
    return await $fetch('/api/comment', {
      method: 'DELETE',
      body: { ids }
    }).catch(error => {
      toastFetchError(error)
      return undefined
    })
  }

  return {
    currentReply,
    setCurrentReply,
    replyInputVisible,
    setReplyInputVisible,

    addComment,
    deleteComments
  }
})
