<template>
  <ElForm
    ref="formRef"
    :model="form"
    :rules="formRules"
    class="border border-gray-200 rounded-lg border-solid bg-white p-2 shadow-sm"
    @submit.prevent
  >
    <ElFormItem prop="message">
      <ElInput
        v-model="form.message"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6 }"
        :maxlength="140"
        show-word-limit
        placeholder="请输入内容，Ctrl + Enter 发送"
        @keydown.ctrl.enter="send()"
      />
    </ElFormItem>

    <div class="w-full flex justify-end">
      <ElButton :loading="isSubmitting" type="primary" @click="send()">评论</ElButton>
    </div>
  </ElForm>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

const commentStore = useCommentStore()
const userSession = useUserSession()

const props = defineProps<{
  parentId?: number
}>()

const formRef = ref<FormInstance | null>(null)

const form = reactive({
  message: ''
})

const formRules: FormRules = {
  message: [
    {
      required: true,
      message: 'message is required',
      trigger: 'blur'
    }
  ]
}

const isSubmitting = ref(false)

const send = useDebounceFn(() => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    isSubmitting.value = true
    await $fetch('/api/comment', {
      method: 'POST',
      body: {
        userId: userSession.user.value?.id,
        parentId: props.parentId,
        replyToId: commentStore.currentReply?.userId,
        content: form.message
      }
    })
      .catch(error => {
        ElMessage.error(error.message)
      })
      .finally(() => {
        isSubmitting.value = false
      })

    form.message = ''
    refreshNuxtData('api-comments')
    commentStore.setReplyInputVisible(false)
  })
}, 300)
</script>

<style>
.el-textarea__inner {
  resize: none;
}
</style>
