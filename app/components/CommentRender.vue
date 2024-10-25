<template>
  <div class="rounded-md p-2">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <div class="flex gap-2 text-sm">
          <div :id="`comment-${id}`" class="text-gray-600 font-bold">{{ user?.name }}</div>
          <ClientOnly>
            <div class="text-gray-500">{{ timeAgo(createdAt) }}</div>
          </ClientOnly>
          <DevOnly>
            <div class="text-gray-500">#{{ id }}</div>
          </DevOnly>
        </div>

        <div class="flex text-sm">
          <ElButton size="small" type="primary" @click="showReplyInput">
            {{ replyInputVisible ? '收起' : '回复' }}
          </ElButton>
        </div>
      </div>

      <div class="text-black">
        <span v-if="parentId" class="text-blue"> 回复 #{{ parentId }}：</span>
        {{ content }}
      </div>
    </div>

    <CommentInput v-if="replyInputVisible" ref="inputRef" :parent-id="id" class="my-2" />

    <ClientOnly>
      <ElTooltip
        v-if="previewMode"
        v-model:visible="tooltipVisible"
        virtual-triggering
        :virtual-ref="triggerRef"
        placement="left-end"
        effect="dark"
        content="Comment is Here"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import type { Measurable } from 'element-plus'

const route = useRoute()
const commentStore = useCommentStore()

const props = defineProps<{
  data: CommentItem
}>()

const { id, user, content, parentId, createdAt } = toRefs(reactive(props.data))

const previewMode = computed(() => route.hash === `#comment-${id.value}`)

const tooltipVisible = ref(false)
const position = ref({})
const triggerRef = ref<Measurable>({
  getBoundingClientRect() {
    return JSON.parse(JSON.stringify(position.value))
  }
})

watchEffect(() => {
  if (route.hash === `#comment-${id.value}`) {
    const el = document.querySelector(route.hash)
    position.value = el!.getBoundingClientRect()
    tooltipVisible.value = true
  }
})

const replyInputVisible = computed(
  () => commentStore.commentInputVisible && commentStore.currentReplyId === id.value
)

const inputRef = ref()

function showReplyInput() {
  if (replyInputVisible.value) {
    commentStore.setCommentInputVisible(false)
  } else {
    commentStore.setCommentInputVisible(true)
    commentStore.setCurrentReplyId(id.value)

    nextTick(() => {
      const el = document.querySelector(`#comment-${parentId.value || id.value}`)
      el?.scrollIntoView({ behavior: 'smooth' })
    })
  }
}
</script>
