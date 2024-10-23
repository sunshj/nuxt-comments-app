<template>
  <div class="h-full flex-center">
    <ElForm ref="formRef" :model="form" class="flex-col gap-2" @submit.prevent>
      <ElFormItem label="Name" prop="name" required>
        <ElInput v-model="form.name" />
      </ElFormItem>

      <ElFormItem label="Email" prop="email" required>
        <ElInput v-model="form.email" type="email" />
      </ElFormItem>

      <div class="w-full flex justify-end">
        <ElButton type="primary" native-type="submit" @click="submit"> login </ElButton>
      </div>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

const form = ref({
  name: '',
  email: ''
})

const formRef = ref<FormInstance | null>(null)

function submit() {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return

    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    }).catch(error => {
      ElMessage.error(error.message)
    })

    await navigateTo('/')
  })
}
</script>
