<template>
  <ElForm
    ref="formRef"
    :model="form"
    :rules="formRules"
    class="border rounded-lg border-solid p-2 shadow-sm border-primary bg-primary"
    @submit.prevent
  >
    <ElFormItem prop="message">
      <ElInput
        v-model="form.message"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6 }"
        :maxlength="1024"
        show-word-limit
        :placeholder="placeholder"
        @keydown.ctrl.enter="send()"
      />
    </ElFormItem>

    <div class="w-full flex items-center justify-between">
      <ElFormItem class="mb-0 flex items-center" label="预览">
        <ElSwitch v-model="preview" size="small" />
      </ElFormItem>
      <ElButton :loading="isSubmitting" type="primary" @click="send()">评论</ElButton>
    </div>

    <MDC
      v-if="preview && form.message"
      :value="form.message"
      class="mt-2 border border-amber rounded-lg border-solid p-2 shadow"
    />
  </ElForm>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const commentStore = useCommentStore()
const userSession = useUserSession()

const props = defineProps<{
  replyToId?: number
  replyToName?: string
}>()

const placeholder = computed(() =>
  props.replyToId && props.replyToName
    ? `回复 ${props.replyToName}：`
    : '请输入内容，Ctrl + Enter 发送'
)

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

const preview = ref(false)

const isSubmitting = ref(false)

const send = useDebounceFn(() => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    isSubmitting.value = true

    const success = await commentStore
      .addComment({
        url: route.path,
        userId: userSession.user.value!.id,
        parentId: props.replyToId ?? null,
        content: form.message.trim()
      })
      .finally(() => {
        isSubmitting.value = false
      })

    if (success) {
      form.message = ''
      preview.value = false
      refreshNuxtData('api-comments')
      commentStore.setReplyInputVisible(false)
    }
  })
}, 300)
</script>

<style>
.el-textarea__inner {
  resize: none;
}
</style>
