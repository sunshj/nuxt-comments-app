<template>
  <div class="relative w-full">
    <span title="click to copy" class="copy-btn" @click="copy($props.code!)">
      {{ $props.language ?? 'text' }}
    </span>
    <pre :class="$props.class">
      <div class="flex-1 px-3">  
        <slot />
      </div> 
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

whenever(copied, () => {
  ElMessage.success('copied')
})
</script>

<style>
pre {
  font-size: 14px;
  background-color: white;
  border-radius: 6px;
  margin-top: 1em;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

pre code {
  display: block;
  white-space: pre;
  margin: -2em 0;
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
  opacity: 1;
}
</style>
