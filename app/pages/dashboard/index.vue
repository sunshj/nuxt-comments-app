<template>
  <div class="w-full flex flex-col gap-4 rounded-xl bg-white p-4">
    <ElForm inline class="w-full">
      <ElFormItem label="筛选" class="min-w-1/4">
        <ElInput v-model="search" clearable placeholder="search name, email, comment." />
      </ElFormItem>

      <ElFormItem label="排序方式">
        <ClientOnly>
          <ElSelect v-model="type" class="w-25">
            <ElOption label="最新" value="recent" />
            <ElOption label="最早" value="oldest" />
          </ElSelect>
          <template #fallback> <ElSelect class="w-25" /></template>
        </ClientOnly>
      </ElFormItem>

      <ElFormItem>
        <ElButton native-type="button" type="primary" @click="debouncedRefresh()"> 刷新 </ElButton>
        <ElButton
          v-if="hasAdminRole && selections.length > 0"
          native-type="button"
          type="danger"
          @click="confirmDelete(selections)"
        >
          删除所选项
        </ElButton>
      </ElFormItem>
    </ElForm>

    <ClientOnly>
      <ElTable
        ref="tableRef"
        v-loading="status === 'pending'"
        stripe
        border
        :data="data?.comments"
        style="width: 100%"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn v-if="hasAdminRole" type="selection" reserve-selection width="55" />
        <ElTableColumn prop="id" label="ID" width="80" />
        <ElTableColumn prop="user.name" label="name" width="120" />
        <ElTableColumn prop="user.email" label="email" width="180" />
        <ElTableColumn prop="user.role" label="role" width="100">
          <template #default="{ row }">
            <ElTag v-if="row.user.role === 'ADMIN'" type="warning">{{ row.user.role }}</ElTag>
            <ElTag v-else type="primary">{{ row.user.role }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="reply.name" label="replyTo" width="100" />
        <ElTableColumn prop="content" label="comment" />
        <ElTableColumn label="createdAt" width="120">
          <template #default="{ row }">
            {{ timeAgo(row.createdAt) }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="Operations" width="200">
          <template #default="{ row }">
            <ElButton type="default" size="small" @click="previewComment(row.id)">
              Preview
            </ElButton>
            <ElButton
              v-if="hasAdminRole"
              type="danger"
              size="small"
              @click="confirmDelete([row.id])"
            >
              Delete
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <template #fallback>
        <ElSkeleton :rows="10" animated />
      </template>
    </ClientOnly>
    <ClientOnly>
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        class="w-full flex-center overflow-x-auto"
        background
        :page-sizes="[10, 20, 50, 100]"
        :total="data?.total ?? 0"
        layout="total, sizes, prev, pager, next, jumper"
      />
      <template #fallback>
        <ElSkeleton :rows="1" animated />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import type { TableInstance } from 'element-plus'

useServerHead({
  title: 'Dashboard'
})

definePageMeta({
  layout: 'dashboard'
})

const { user } = useUserSession()

const hasAdminRole = computed(() => user.value?.role === 'ADMIN')

const tableRef = ref<TableInstance>()

const currentPage = ref(1)
const pageSize = ref(10)
const selections = ref<number[]>([])

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const type = ref<'recent' | 'oldest'>('recent')

const queryParams = computed(() => ({
  type: type.value,
  page: currentPage.value,
  size: pageSize.value,
  search: debouncedSearch.value
}))

const { data, status, error, refresh } = useFetch('/api/comment/list', {
  query: queryParams,
  watch: [currentPage, pageSize]
})

const debouncedRefresh = useDebounceFn(refresh, 300)

watch(error, err => {
  if (err) {
    ElMessage.error(`${err?.data?.statusCode} ${err?.data?.statusMessage}`)
  }
})

function handleSelectionChange(selection: any[]) {
  selections.value = selection.map(item => item.id)
}

function previewComment(id: number) {
  navigateTo({ path: '/', hash: `#comment-${id}` }, { open: { target: '_blank' } })
}

function confirmDelete(ids: number[]) {
  ElMessageBox.confirm(`Are you sure you want to delete ${ids.length} comments?`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await $fetch('/api/comment', {
        method: 'DELETE',
        body: { ids }
      })
      tableRef.value?.clearSelection()
      refresh()
    })
    .catch(() => {
      ElMessage.info('Delete canceled')
    })
}
</script>
