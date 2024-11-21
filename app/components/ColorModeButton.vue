<template>
  <ElButton link class="text-xl icon-primary" @click="$colorMode.preference = next()">
    <Icon v-if="$colorMode.preference === 'light'" name="lucide:sun" />
    <Icon v-else-if="$colorMode.preference === 'dark'" name="lucide:moon" />
    <Icon v-else name="lucide:sun-moon" />
  </ElButton>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const { next } = useCycleList(['system', 'light', 'dark'], { initialValue: colorMode.preference })
</script>
