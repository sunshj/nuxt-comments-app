<template>
  <div class="relative w-full">
    <span title="click to copy" class="copy-btn" @click="copy($props.code!)">
      {{ $props.language ?? 'text' }}
    </span>
    <pre :class="$props.class">
      <slot />  
    </pre>
  </div>
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
pre {
  font-size: 14px;
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  margin-top: 1em;
  overflow-x: auto;
}

pre code {
  display: block;
  margin-top: -1em;
  margin-bottom: -2em;
  white-space: pre;
}

pre code .line {
  display: block;
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
