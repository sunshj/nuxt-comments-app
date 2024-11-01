<template>
  <div
    v-for="item in withActiveData"
    v-bind="$attrs"
    :key="item.id"
    class="w-full flex flex-col gap-2"
  >
    <CommentRender v-model:active="item.active" :data="item" />
    <div v-show="item.active">
      <CommentList v-if="item.children.length > 0" :data="item.children" class="pl-5" />
    </div>
    <ElDivider v-if="!item.parentId" />
  </div>
</template>

<script lang="ts" setup>
import type { CommentItem } from '~~/server/utils'

const props = defineProps<{
  data: CommentItem[]
}>()

const withActiveData = ref<Array<CommentItem & { active: boolean }>>([])

watchEffect(() => {
  withActiveData.value = props.data.map(v => ({ ...v, active: true }))
})
</script>
