<template>
  <div class="h-full flex-center flex-col gap-2">
    <UserSelect :data="users!" />
    <ElButton type="primary">
      <NuxtLink class="text-white no-underline" to="/comment">go comment</NuxtLink>
    </ElButton>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/server/utils/drizzle'

const { data: users } = useFetch<User[]>('/api/users')
</script>
