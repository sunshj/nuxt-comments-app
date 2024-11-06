<template>
  <div class="relative w-full">
    <span title="click to copy" class="copy-btn" @click="copy($props.code!)">
      {{ $props.filename ? $props.filename : ($props.language?.toUpperCase() ?? 'code') }}
    </span>
    <pre :class="$props.class" class="border border-solid border-fill bg-fill">
      <div class="flex-1">  
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
  border-radius: 6px;
  margin: 10px 0;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

pre code {
  display: block;
  white-space: pre;
  margin: -2em 0;
  padding: 0 1rem;
  border-radius: 6px;
}

pre code .line {
  display: block;
  position: relative;
  margin: 0 -1rem;
  padding: 0 1rem;
  width: calc(100% + 2rem);
}

pre code .line.highlight {
  display: inline-block;
  background-color: #8e96aa24 !important;
}

pre code .line.diff.remove {
  background-color: #f43f5e24;
  opacity: 0.6;
}

pre code .line.diff.add {
  background-color: #10b98124;
}

pre code .line.diff.remove::before {
  content: '－';
  color: #c23a3a;
  position: absolute;
  left: 5px;
}

pre code .line.diff.add::before {
  content: '＋';
  color: #23b73c;
  position: absolute;
  left: 5px;
}

.copy-btn {
  position: absolute;
  inset: 0 0 auto auto;
  z-index: 100;
  cursor: pointer;
  padding: 6px;
  font-size: 16px;
  font-weight: bold;
  color: #3c3c438f;
  opacity: 0.3;
  transition: all 0.2s ease-in-out;
}

.dark .copy-btn {
  color: #ebebf561;
}

.copy-btn:hover {
  opacity: 1;
}
</style>
