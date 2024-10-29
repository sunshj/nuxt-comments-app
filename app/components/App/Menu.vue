<template>
  <ElMenu :default-active="$route.name" active-text-color="#0051c3" class="border-r-none">
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

const menus = computed(() =>
  routes
    .filter(r => !!r.meta.menuConfig)
    .sort((a, b) => (a.meta.menuConfig?.order || 0) - (b.meta.menuConfig?.order || 0))
    .map(({ meta, path, name }) => {
      return {
        ...meta.menuConfig,
        name: name?.toString(),
        path
      }
    })
)
</script>

<style scoped>
.el-menu-item.is-active {
  background-color: #f2f2f2;
}
</style>
