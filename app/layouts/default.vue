<template>
  <div>
    <ElContainer direction="vertical" class="h-screen w-full flex flex-col">
      <AppHeader title="Nuxt Comments App" :show-profile="false" />
      <ElMain
        class="flex-1 justify-center bg-secondary"
        :class="{
          'p-0': $device.isMobile
        }"
      >
        <slot />
      </ElMain>
    </ElContainer>
  </div>
</template>

<script lang="ts" setup></script>
