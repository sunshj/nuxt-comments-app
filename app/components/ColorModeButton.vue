<template>
  <ElButton
    link
    class="text-xl icon-primary"
    @click="$colorMode.preference = $colorMode.preference === 'light' ? 'dark' : 'light'"
  >
    <Icon v-if="$colorMode.value === 'light'" name="lucide:sun" />
    <Icon v-else name="lucide:moon" />
  </ElButton>
</template>

<script lang="ts" setup></script>
