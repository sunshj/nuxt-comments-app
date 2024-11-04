<template>
  <ElHeader
    v-bind="$attrs"
    class="z-10 h-16 flex items-center justify-between bg-zinc-800 text-white"
  >
    <div>{{ props.title }}</div>

    <div class="flex items-center gap-4">
      <ClientOnly>
        <ElPopover placement="bottom" width="fit-content" trigger="click">
          <template #reference>
            <div class="m-2 flex-center cursor-pointer">
              <IconInfo class="text-xl text-gray-300" />
            </div>
          </template>

          <NuxtLink :href="gitCommitUrl" target="_blank">
            Built {{ builtTime }} ({{ shortenGitSha }})
          </NuxtLink>
        </ElPopover>

        <template #fallback>
          <div class="m-2 flex-center cursor-pointer">
            <IconInfo class="text-xl text-gray-300" />
          </div>
        </template>
      </ClientOnly>

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
const config = useRuntimeConfig()

const props = withDefaults(
  defineProps<{
    title: string
    showProfile?: boolean
  }>(),
  {
    showProfile: true
  }
)

const builtTime = timeAgo(config.public.buildTime)
const shortenGitSha = config.public.gitSha.slice(0, 5)
const gitCommitUrl = `${config.public.repoUrl}/commit/${config.public.gitSha}`
</script>
