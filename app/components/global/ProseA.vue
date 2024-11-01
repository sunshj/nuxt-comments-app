<template>
  <NuxtLink :target>
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const attrs = useAttrs()

const footnoteDataset = ['data-footnote-ref', 'data-footnote-backref']

const target = computed(() => {
  if (footnoteDataset.some(dataset => Object.keys(attrs).includes(dataset))) return '_self'
  return '_blank'
})
</script>
