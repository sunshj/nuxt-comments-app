<template>
  <pre :class="$props.class">
    <span  class="copy-btn" @click="copy($props.code!)">{{ $props.language ?? 'text' }}</span>
    <slot />
</pre>
</template>

<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const { copy, copied } = useClipboard({ legacy: true })

watchEffect(() => {
  if (copied.value) {
    ElMessage.success('copied')
  }
})
</script>

<style>
pre > code {
  display: block;
  margin-top: -2em;
  white-space: pre;
}

pre code .line {
  display: block;
}

pre {
  font-size: 14px;
  background-color: white;
  padding: 0 6px;
  border-radius: 6px;
  overflow-x: auto;
  margin-top: 1em;
  position: relative;
}

.copy-btn {
  position: absolute;
  inset: 0 0 auto auto;
  z-index: 100;
  cursor: pointer;
  padding: 6px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: bold;
  color: #64778b;
  opacity: 0.2;
  transition: all 0.2s ease-in-out;
}

.copy-btn:hover {
  opacity: 1 !important;
}
</style>
