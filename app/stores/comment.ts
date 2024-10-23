export const useCommentStore = defineStore(
  'comment',
  () => {
    const refreshCount = ref(0)

    function refresh() {
      refreshCount.value++
    }

    const currentReplyId = ref(0)

    function setCurrentReplyId(id: number) {
      currentReplyId.value = id
    }

    const commentInputVisible = ref(false)

    function setCommentInputVisible(visible: boolean) {
      commentInputVisible.value = visible
    }

    return {
      refreshCount,
      refresh,
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
