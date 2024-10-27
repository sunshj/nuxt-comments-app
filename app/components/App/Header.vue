<template>
  <ElHeader v-bind="$attrs" class="h-16 flex items-center justify-between bg-zinc-800 text-white">
    <div>{{ props.title }}</div>

    <div class="flex items-center gap-4">
      <ClientOnly>
        <ElDropdown>
          <ElAvatar :src="userStore.user?.avatarUrl!" class="cursor-pointer">
            {{ userStore.user?.name }}
          </ElAvatar>

          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                v-if="props.showProfile && $route.path !== '/dashboard/profile'"
                @click="navigateTo('/dashboard/profile')"
              >
                个人中心
              </ElDropdownItem>
              <ElDropdownItem @click="userStore.logout()">退出</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <template #fallback>
          <ElAvatar />
        </template>
      </ClientOnly>
    </div>
  </ElHeader>
</template>

<script lang="ts" setup>
const userStore = useUserStore()

const props = withDefaults(
  defineProps<{
    title: string
    showProfile?: boolean
  }>(),
  {
    showProfile: true
  }
)
</script>
