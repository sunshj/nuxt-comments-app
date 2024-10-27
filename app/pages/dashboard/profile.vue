<template>
  <div class="flex flex-col gap-4">
    <ElPageHeader @back="navigateTo('/dashboard')">
      <template #content>
        <span class="mr-3 text-xl font-600">
          <ClientOnly>
            {{ userStore.user?.name }}
            <template #fallback> {{ userForm?.name }}</template>
          </ClientOnly>
          's profile
        </span>
      </template>
    </ElPageHeader>

    <ElForm v-if="userForm" class="rounded-md bg-white px-4 py-6" :model="userForm" @submit.prevent>
      <ElFormItem prop="name" label="Name">
        <ElInput v-model="userForm.name" clearable />
      </ElFormItem>
      <ElFormItem prop="email" label="Email">
        <ElInput v-model="userForm.email" clearable />
      </ElFormItem>
      <ElFormItem prop="avatarUrl" label="Avatar">
        <ElInput v-model="userForm.avatarUrl" clearable />
      </ElFormItem>

      <ElFormItem prop="role" label="Role">
        <ElTag v-if="userForm.role === 'ADMIN'" type="warning">{{ userForm.role }}</ElTag>
        <ElTag v-else type="primary">{{ userForm.role }}</ElTag>
      </ElFormItem>

      <ElFormItem label="Registered At">
        <ElTag size="large" type="info">
          {{ formatTime(userForm.createdAt) }}
        </ElTag>
      </ElFormItem>

      <ElFormItem label="Updated At">
        <ElTag size="large" type="info">
          {{ formatTime(userForm.updatedAt) }}
        </ElTag>
      </ElFormItem>

      <ElButton type="primary" native-type="submit" @click="updateUser">Update</ElButton>
    </ElForm>
  </div>
</template>

<script lang="ts" setup>
useServerHead({
  title: 'Profile'
})

definePageMeta({
  layout: 'dashboard'
})

const { user } = useUserSession()
const userStore = useUserStore()

const {
  data: userForm,
  error,
  refresh
} = useFetch<SerializedUser>(() => `/api/user/${user.value?.id}`, {
  deep: true
})

watch(error, err => {
  if (err) {
    ElMessage.error(`${err?.data?.statusCode} ${err?.data?.statusMessage}`)
  }
})

async function updateUser() {
  const { id, name, email, avatarUrl } = userForm.value!

  const success = await userStore.updateUser(id, { name, email, avatarUrl }).catch(error => {
    ElMessage.error(error.message)
    return null
  })

  if (success) {
    ElMessage.success('User updated successfully')
    refresh()
  }
}
</script>
