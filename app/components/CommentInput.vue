<template>
  <ElForm
    ref="formRef"
    :model="form"
    :rules="formRules"
    class="border border-amber rounded-lg border-solid p-2"
    @submit.prevent
  >
    <ElFormItem prop="message">
      <ElInput
        v-model="form.message"
        type="textarea"
        :rows="2"
        placeholder="请输入内容，Ctrl + Enter 发送"
        @keydown.ctrl.enter="send()"
      />
    </ElFormItem>

    <div class="w-full flex justify-end">
      <ElButton type="primary" @click="send()">评论</ElButton>
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

function send() {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    await $fetch('/api/comment', {
      method: 'POST',
      body: {
        userId: userSession.user.value?.id,
        parentId: props.parentId ?? 0,
        content: form.message
      }
    }).catch(error => {
      ElMessage.error(error.message)
    })

    form.message = ''
    commentStore.refresh()
    commentStore.setCommentInputVisible(false)
  })
}
</script>
