<template>
  <ElForm
    ref="formRef"
    :model="form"
    :rules="formRules"
    class="border border-amber rounded-lg border-solid p-2"
  >
    <ElFormItem prop="message">
      <ElInput v-model="form.message" type="textarea" :rows="2" placeholder="请输入内容" />
    </ElFormItem>

    <div class="w-full flex justify-between">
      <ElButton type="primary" @click="send()">评论</ElButton>
    </div>
  </ElForm>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

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
        userId: store.loggedInUser?.id,
        parentId: props.parentId ?? 0,
        content: form.message
      }
    })

    form.message = ''
    store.incrementRefreshCount()
    store.setChildCommentInputVisible(false)
  })
}
</script>
