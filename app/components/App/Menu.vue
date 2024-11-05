<template>
  <ElMenu :default-active="$route.name" class="border-r-none">
    <ElMenuItem
      v-for="menu in menus"
      :key="menu.path"
      :index="menu.name"
      @click="navigateTo(menu.path)"
    >
      {{ menu.title }}
    </ElMenuItem>
  </ElMenu>
</template>

<script lang="ts" setup>
const router = useRouter()
const routes = router.getRoutes()
const { user } = useUserSession()

const menus = computed(() => {
  if (!user.value) return []
  return routes
    .filter(r => !!r.meta.menu && r.meta.roles?.includes(user.value!.role))
    .sort((a, b) => (a.meta.menu?.order || 0) - (b.meta.menu?.order || 0))
    .map(({ meta, path, name }) => {
      return {
        ...meta.menu,
        name: name?.toString(),
        path
      }
    })
})
</script>

<style scoped>
.el-menu-item.is-active {
  background-color: var(--el-fill-color);
}
</style>
