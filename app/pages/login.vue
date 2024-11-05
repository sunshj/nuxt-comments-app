<template>
  <div class="h-full flex-center bg-secondary">
    <div
      class="z-1 w-100 flex flex-col gap-4 border rounded-lg border-solid px-6 py-4 shadow-md border-primary bg-primary"
    >
      <h1 class="text-center text-2xl font-bold">{{ action }}</h1>
      <ElSegmented v-model="action" :options="actionOptions" />
      <ElForm
        ref="formRef"
        class="flex flex-col gap-2"
        status-icon
        :model="form"
        :rules="formRules"
        @submit.prevent
      >
        <ElFormItem v-if="action === 'Sign up'" prop="name" required>
          <ElInput v-model="form.name" clearable placeholder="Your name" />
        </ElFormItem>

        <ElFormItem prop="email" required>
          <ElInput v-model="form.email" type="email" clearable placeholder="Your email" />
        </ElFormItem>

        <ElFormItem prop="password" required>
          <ElInput
            v-model="form.password"
            type="password"
            clearable
            show-password
            placeholder="Your password"
          />
        </ElFormItem>

        <ElButton
          class="w-full bg-#0665d0 active:bg-#044396 hover:bg-#0553ab"
          :loading="isSubmitting"
          type="primary"
          native-type="submit"
          @click="submit"
        >
          {{ action }}
        </ElButton>
      </ElForm>
    </div>

    <canvas class="absolute inset-0 h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({
  layout: false
})

useServerHead({
  title: 'Sign in',
  script: [
    {
      src: 'https://cdn.jsdelivr.net/gh/sunshj/Staticfile@master/js/evanyou.js',
      defer: true
    }
  ]
})

const userStore = useUserStore()
const userSession = useUserSession()

const action = ref<AuthenticateAction>('Sign in')
const actionOptions: AuthenticateAction[] = ['Sign in', 'Sign up']

const form = ref({
  name: '',
  email: '',
  password: ''
})

const formRules: FormRules<typeof form.value> = {
  email: [
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: 'blur'
    }
  ],
  password: [
    {
      min: 6,
      message: 'Password length should be at least 6',
      trigger: 'blur'
    }
  ]
}

const formRef = ref<FormInstance | null>(null)

const isSubmitting = ref(false)

const submit = useDebounceFn(() => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    isSubmitting.value = true
    const { name, email, password } = form.value

    if (action.value === 'Sign up') {
      const registerSuccess = await userStore.register({ name, email, password }).finally(() => {
        isSubmitting.value = false
      })

      if (registerSuccess) {
        ElMessage.success('Register successfully')
        action.value = 'Sign in'
      }
    }

    if (action.value === 'Sign in') {
      const loginSuccess = await userStore.login({ email, password }).finally(() => {
        isSubmitting.value = false
      })

      if (loginSuccess) {
        ElMessage.success('Login successfully')
        await userSession.fetch()
        navigateTo('/')
      }
    }
  })
}, 300)
</script>
