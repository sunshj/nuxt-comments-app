<template>
  <NuxtLink :target="target">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const attrs = useAttrs()

const footnoteAttrs = ['data-footnote-ref', 'data-footnote-backref']

const target = computed(() => {
  if (footnoteAttrs.some(attr => Object.keys(attrs).includes(attr))) return '_self'
  return '_blank'
})
</script>
