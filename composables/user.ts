export const store = reactive({
  loggedInUser: undefined as User | undefined,

  refreshCount: 0,
  incrementRefreshCount() {
    this.refreshCount++
  },

  currentReplyId: 0,
  setCurrentReplyId(id: number) {
    this.currentReplyId = id
  },

  childCommentInputVisible: false,
  setChildCommentInputVisible(val: boolean) {
    this.childCommentInputVisible = val
  }
})
