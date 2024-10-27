<template>
  <div class="flex items-start gap-2 rounded-md p-2">
    <div :id="`comment-${id}`" class="pt-1"><ElAvatar :src="user.avatarUrl!" /></div>
    <div class="flex flex-1 flex-col gap-2">
      <div class="flex justify-between">
        <div class="flex gap-2 text-sm">
          <div class="text-gray-600 font-bold">{{ user?.name }}</div>
          <ClientOnly>
            <div class="text-gray-500">{{ timeAgo(createdAt) }}</div>
          </ClientOnly>
          <DevOnly>
            <div class="text-gray-500">#{{ id }}</div>
          </DevOnly>
        </div>

        <div class="flex text-sm">
          <ElButton size="small" type="primary" @click="showReplyInput">
            {{ currentReplyInputVisible ? '收起' : '回复' }}
          </ElButton>
        </div>
      </div>

      <div class="text-black">
        <span v-if="parentId" class="text-blue"> 回复 {{ reply?.name }}：</span>
        {{ content }}
      </div>
      <CommentReply v-if="currentReplyInputVisible" :parent-id="id" class="my-2" />
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
  data: CommentItem
}>()

const { id, user, content, parentId, reply, createdAt } = toRefs(reactive(props.data))

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

  commentStore.setCurrentReply(props.data)
  nextTick(() => {
    const el = document.querySelector(`#comment-${parentId.value || id.value}`)
    el?.scrollIntoView({ behavior: 'smooth' })
  })
}
</script>
