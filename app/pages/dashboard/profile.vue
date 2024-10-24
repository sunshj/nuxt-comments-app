<template>
  <div class="flex flex-col gap-4">
    <ElPageHeader @back="navigateTo('/dashboard')">
      <template #content>
        <span class="mr-3 text-xl font-600"> {{ userStore.user?.name }}'s profile </span>
      </template>
    </ElPageHeader>

    <ElForm class="rounded-md bg-white px-4 py-6" :model="form" @submit.prevent>
      <ElFormItem prop="name" label="Name">
        <ElInput v-model="form.name" clearable />
      </ElFormItem>
      <ElFormItem prop="email" label="Email">
        <ElInput v-model="form.email" clearable />
      </ElFormItem>
      <ElFormItem prop="avatarUrl" label="Avatar URL">
        <ElInput v-model="form.avatarUrl" clearable />
      </ElFormItem>

      <ElFormItem prop="role" label="Role">
        <ElTag v-if="form.role === 'ADMIN'" type="warning">{{ form.role }}</ElTag>
        <ElTag v-else type="primary">{{ form.role }}</ElTag>
      </ElFormItem>

      <ElFormItem label="Registered At">
        {{ form.createdAt }} ({{ timeAgo(form.createdAt) }})
      </ElFormItem>

      <ElFormItem label="Updated At">
        {{ form.updatedAt }} ({{ timeAgo(form.updatedAt) }})
      </ElFormItem>

      <ElButton type="primary" native-type="submit" @click="updateUser">Update</ElButton>
    </ElForm>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@prisma/client'
import type { WithSerializedDates } from '~~/server/utils'

useHead({
  title: 'Profile'
})

definePageMeta({
  layout: 'dashboard'
})

const { user } = useUserSession()
const userStore = useUserStore()

const form = ref<WithSerializedDates<User>>({
  id: 0,
  name: '',
  email: '',
  avatarUrl: '',
  role: 'USER',
  createdAt: '',
  updatedAt: ''
})

const { data: userInfo, refresh } = useFetch<WithSerializedDates<User>>(
  `/api/user/${user.value?.id}`
)

watch(userInfo, newVal => {
  if (newVal) {
    form.value = newVal
  }
})

async function updateUser() {
  const { id, name, email, avatarUrl } = form.value!

  const success = await $fetch(`/api/user/${id}`, {
    method: 'PUT',
    body: { name, email, avatarUrl }
  }).catch(error => {
    ElMessage.error(error.message)
    return null
  })
  if (success) {
    ElMessage.success('User updated successfully')
    refresh()
  }
}
</script>
