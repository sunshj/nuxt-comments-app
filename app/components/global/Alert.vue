<template>
  <ElAlert :type :closable="false" show-icon>
    <MDCSlot unwrap="p" />
  </ElAlert>
</template>

<script lang="ts" setup>
defineProps(['type'])
</script>

<style scoped>
.el-alert:not(:first-child) {
  margin-top: 1rem;
}
</style>
