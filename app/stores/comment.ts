export const useCommentStore = defineStore(
  'comment',
  () => {
    const currentReplyId = ref(0)

    function setCurrentReplyId(id: number) {
      currentReplyId.value = id
    }

    const commentInputVisible = ref(false)

    function setCommentInputVisible(visible: boolean) {
      commentInputVisible.value = visible
    }

    return {
      currentReplyId,
      setCurrentReplyId,
      commentInputVisible,
      setCommentInputVisible
    }
  },
  {
    persist: true
  }
)
