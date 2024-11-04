<template>
  <div class="relative w-full">
    <span title="click to copy" class="copy-btn" @click="copy($props.code!)">
      {{ $props.language ?? 'text' }}
    </span>
    <pre :class="$props.class">
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
  background-color: #8881;
  border: 1px solid #8881;
  border-radius: 6px;
  margin-top: 10px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.line-numbers-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  border-right: 1px solid var(--vp-code-block-divider-color);
  padding-top: 20px;
  width: 32px;
  text-align: center;
  font-family: var(--vp-font-family-mono);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  color: var(--vp-code-line-number-color);
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
  background-color: #8e96aa24;
}

pre code .line.diff.remove {
  background-color: #f43f5e24;
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
