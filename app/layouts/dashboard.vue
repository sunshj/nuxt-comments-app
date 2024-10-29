<template>
  <ElContainer direction="vertical" class="h-full w-full">
    <AppHeader title="Dashboard" />
    <ElContainer class="h-full">
      <ElAside width="120px" class="fixed bottom-0 left-0 top-16 overflow-x-hidden pb-16">
        <AppMenu />
      </ElAside>

      <ElMain
        class="absolute inset-0 left-120px overflow-y-auto bg-zinc-100 p-4 pt-20 text-zinc-900"
      >
        <slot />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script lang="ts" setup></script>

<style scoped>
.el-aside {
  border-right: 1px solid #d9d9d9;
}
</style>
