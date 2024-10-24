<template>
  <div class="w-full flex flex-col gap-4 rounded-xl bg-white p-4">
    <ElRow class="w-full flex" :gutter="20">
      <ElCol :span="8" :xs="24">
        <ElFormItem label="筛选">
          <ElInput v-model="search" clearable placeholder="Search name/email/comment." />
        </ElFormItem>
      </ElCol>
      <ElCol :span="6" :xs="24">
        <ElFormItem label="排序方式">
          <ElSelect v-model="sort">
            <ClientOnly>
              <ElOption label="最新" value="desc" />
              <ElOption label="最早" value="asc" />
            </ClientOnly>
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <ElCol :span="6" :xs="24">
        <ElButton type="primary" @click="refresh()"> 刷新 </ElButton>
        <ElButton
          v-if="hasAdminRole && selections.length > 0"
          type="danger"
          @click="confirmDelete(selections)"
        >
          删除所选项
        </ElButton>
      </ElCol>
    </ElRow>

    <ClientOnly>
      <ElTable
        ref="tableRef"
        v-loading="status === 'pending'"
        stripe
        border
        :data="pagedComments"
        style="width: 100%"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn v-if="hasAdminRole" type="selection" reserve-selection width="55" />
        <ElTableColumn prop="id" label="ID" width="80" />
        <ElTableColumn prop="user.name" label="name" width="120" />
        <ElTableColumn prop="user.email" label="email" width="150" />
        <ElTableColumn prop="user.role" label="role" width="100">
          <template #default="{ row }: { row: CommentItem }">
            <ElTag v-if="row.user.role === Role.ADMIN" type="warning">{{ row.user.role }}</ElTag>
            <ElTag v-else type="primary">{{ row.user.role }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="parentId" label="parentId" width="100" />
        <ElTableColumn prop="content" label="comment" />
        <ElTableColumn label="createdAt" width="120">
          <template #default="{ row }">
            {{ timeAgo(row.createdAt) }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="Operations" min-width="120">
          <template #default="{ row }: { row: CommentItem }">
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
    </ClientOnly>
    <ClientOnly>
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        class="w-full flex-center overflow-x-auto"
        background
        :page-sizes="[10, 20, 50, 100]"
        :total="comments?.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { Role } from '@prisma/client'
import type { CommentItem } from '~~/server/utils'
import type { TableInstance } from 'element-plus'

useHead({
  title: 'Dashboard'
})

definePageMeta({
  layout: 'dashboard'
})

const { user } = useUserSession()

const hasAdminRole = computed(() => user.value?.role === Role.ADMIN)

const tableRef = ref<TableInstance>()

const currentPage = ref(1)
const pageSize = ref(10)
const selections = ref<number[]>([])

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const sort = ref<'desc' | 'asc'>('asc')

const queryParams = computed(() => ({
  search: debouncedSearch.value,
  sort: sort.value
}))

const {
  data: comments,
  status,
  refresh
} = useFetch('/api/comments', {
  query: queryParams,
  watch: [currentPage, pageSize]
})

const pagedComments = computed(() =>
  comments.value?.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
)

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
