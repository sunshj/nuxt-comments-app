<template>
  <div class="h-full flex-center bg-blueGray-50">
    <div
      class="z-1 w-100 flex flex-col gap-4 border border-gray-200 rounded-lg border-solid bg-white px-6 py-4 shadow-md"
    >
      <h1 class="text-center text-2xl font-bold">Sign in</h1>
      <ElForm ref="formRef" class="flex flex-col gap-2" status-icon :model="form" @submit.prevent>
        <ElFormItem prop="name" required>
          <ElInput v-model="form.name" clearable placeholder="Your name" />
        </ElFormItem>

        <ElFormItem prop="email" required>
          <ElInput v-model="form.email" type="email" clearable placeholder="Your email" />
        </ElFormItem>

        <ElButton
          class="w-full bg-#0665d0 active:bg-#044396 hover:bg-#0553ab"
          :loading="isSubmitting"
          type="primary"
          native-type="submit"
          @click="submit"
        >
          login
        </ElButton>
      </ElForm>
    </div>

    <canvas class="absolute inset-0 h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

definePageMeta({
  layout: false
})

useHead({
  title: 'Sign in',
  script: [
    {
      src: 'https://cdn.jsdelivr.net/gh/sunshj/Staticfile@master/js/evanyou.js',
      defer: true
    }
  ]
})

const userStore = useUserStore()

const form = ref({
  name: '',
  email: ''
})

const formRef = ref<FormInstance | null>(null)

const isSubmitting = ref(false)

function submit() {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    isSubmitting.value = true
    const success = await userStore
      .login(form.value)
      .catch(error => {
        ElMessage.error(error.message)
        return null
      })
      .finally(() => {
        isSubmitting.value = false
      })

    if (success) {
      ElMessage.success('Login successfully')
      await navigateTo('/')
    }
  })
}
</script>
