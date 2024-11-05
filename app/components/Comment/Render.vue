<template>
  <div class="w-full flex items-start gap-2 rounded-md p-2">
    <div :id="`comment-${id}`" class="pt-1">
      <ElAvatar :src="user.avatarUrl!" />
    </div>
    <div class="w-full flex flex-1 flex-col gap-2 overflow-hidden">
      <div class="flex justify-between">
        <div class="flex gap-2 text-sm">
          <div class="font-bold text-primary">{{ user?.name }}</div>
          <ClientOnly>
            <div class="text-secondary">{{ timeAgo(createdAt) }}</div>
          </ClientOnly>
          <DevOnly>
            <div class="text-secondary">#{{ id }}</div>
          </DevOnly>
        </div>

        <div class="flex text-sm">
          <ElButton
            v-if="!commentStore.replyInputVisible && !parentId && children.length > 0"
            size="small"
            @click="collapse = !collapse"
          >
            {{ collapse ? `(${children.length})展开` : '收起' }}
          </ElButton>

          <ElButton size="small" type="primary" @click="showReplyInput">
            {{ currentReplyInputVisible ? '收起' : '回复' }}
          </ElButton>
        </div>
      </div>

      <div class="w-full text-primary">
        <div v-if="parentId" class="mb-1 text-sm text-blue">回复 {{ parent?.user.name }}：</div>
        <MDC class="w-full lh-relaxed" :value="content" />
      </div>
      <CommentReply
        v-if="currentReplyInputVisible"
        :reply-to-id="id"
        :reply-to-name="user.name"
        class="my-2"
      />
    </div>

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
  comment: CommentItem
}>()

const collapse = defineModel<boolean>('collapse', { default: false })

const { id, user, content, parentId, parent, createdAt, children } = toRefs(reactive(props.comment))

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

const currentReplyInputVisible = computed(
  () => commentStore.replyInputVisible && commentStore.currentReply?.id === id.value
)

function showReplyInput() {
  if (currentReplyInputVisible.value) {
    commentStore.setReplyInputVisible(false)
    return
  }

  if (!commentStore.replyInputVisible) {
    commentStore.setReplyInputVisible(true)
  }

  commentStore.setCurrentReply(props.comment)
  nextTick(() => {
    const el = document.querySelector(`#comment-${id.value}`)
    el?.scrollIntoView({ behavior: 'smooth' })
  })
}
</script>
