<template>
  <ElContainer direction="vertical" class="h-full w-full">
    <AppHeader title="Dashboard" />

    <ElContainer class="h-full">
      <div
        v-if="$device.isMobile"
        class="z-10 h-8 w-full flex justify-between px-2 py-1 text-sm shadow-sm bg-primary text-primary"
      >
        <div class="flex items-center gap-1" @click="sideDrawerVisible = true">
          <IconMenu />
          <div>菜单</div>
        </div>
      </div>

      <ElAside v-else width="120px" class="fixed bottom-0 left-0 top-16 overflow-x-hidden pb-16">
        <AppMenu />
      </ElAside>

      <ElMain
        class="absolute inset-0 z-2 overflow-y-auto bg-secondary"
        :class="{
          'left-0 px-2 pt-26': $device.isMobile,
          'left-120px px-4 pt-20': !$device.isMobile
        }"
      >
        <div class="w-full rounded-md p-4 bg-primary">
          <slot />
        </div>
      </ElMain>
    </ElContainer>

    <ClientOnly>
      <ElDrawer
        v-if="$device.isMobile"
        v-model="sideDrawerVisible"
        :with-header="false"
        direction="ltr"
        size="50%"
        class="pt-16"
      >
        <AppMenu />
      </ElDrawer>
    </ClientOnly>
  </ElContainer>
</template>

<script lang="ts" setup>
const route = useRoute()

const sideDrawerVisible = ref(false)

watch(
  () => route.path,
  () => {
    sideDrawerVisible.value = false
  }
)
</script>

<style scoped>
:deep(.el-drawer .el-drawer__body) {
  padding: 0;
}
</style>
