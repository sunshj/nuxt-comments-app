<template>
  <div class="w-full flex flex-col gap-4">
    <ElForm inline class="w-full">
      <ElFormItem label="筛选" class="min-w-1/4 lt-sm:w-full">
        <ElInput v-model="search" clearable placeholder="search name, email, comment." />
      </ElFormItem>

      <ElFormItem label="分类">
        <ClientOnly>
          <ElSelect v-model="type" class="w-25">
            <ElOption label="全部" value="all" />
            <ElOption label="仅评论" value="comment" />
            <ElOption label="仅回复" value="replies" />
          </ElSelect>
        </ClientOnly>
      </ElFormItem>

      <ElFormItem label="排序">
        <ClientOnly>
          <ElSelect v-model="sort" class="w-25">
            <ElOption label="最新" value="recent" />
            <ElOption label="最早" value="oldest" />
          </ElSelect>
        </ClientOnly>
      </ElFormItem>

      <ElFormItem label="URL" class="lt-sm:w-full">
        <ElInput v-model="url" clearable placeholder="search url, start with /" />
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
        :data="data?.comments"
        style="width: 100%"
        border
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn v-if="hasAdminRole" type="selection" reserve-selection width="55" />
        <ElTableColumn prop="id" label="ID" width="60" />
        <ElTableColumn prop="url" label="url" width="100" show-overflow-tooltip />
        <ElTableColumn label="type" width="80">
          <template #default="{ row }">
            <ElTag v-if="!row.parentId" type="primary">评论</ElTag>
            <ElTag v-else type="info">回复</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="user.name" label="name" width="80" />
        <ElTableColumn prop="user.email" label="email" width="180" />
        <ElTableColumn prop="user.role" label="role" width="100">
          <template #default="{ row }">
            <ElTag v-if="row.user.role === 'ADMIN'" type="warning">{{ row.user.role }}</ElTag>
            <ElTag v-else type="info">{{ row.user.role }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="parentId" label="parentId" width="90" />
        <ElTableColumn prop="parent.user.name" label="replyTo" width="80" />

        <ElTableColumn label="comment" header-align="center" :render-header="renderContentHeader">
          <ElTableColumn prop="content">
            <template #default="{ row }">
              <div class="overflow-hidden text-ellipsis whitespace-nowrap">{{ row.content }}</div>
            </template>
          </ElTableColumn>

          <ElTableColumn type="expand">
            <template #default="{ row }">
              <div class="relative p-2 bg-secondary">
                <CodeCopy class="absolute right-5 top-3" :code="row.content" />
                <pre>{{ row.content }}</pre>
              </div>
            </template>
          </ElTableColumn>
        </ElTableColumn>

        <ElTableColumn label="createdAt" width="100">
          <template #default="{ row }">
            {{ timeAgo(row.createdAt) }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="Operations" width="180">
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
  layout: 'dashboard',
  roles: ['ADMIN', 'USER'],
  menu: {
    title: 'Comments',
    order: 0
  }
})

const { user } = useUserSession()
const commentStore = useCommentStore()
const hasAdminRole = computed(() => user.value?.role === 'ADMIN')

const tableRef = ref<TableInstance>()

const currentPage = ref(1)
const pageSize = ref(10)
const selections = ref<number[]>([])

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const type = ref<'all' | 'comment' | 'replies'>('all')
const sort = ref<'recent' | 'oldest'>('recent')
const url = ref('')

const queryParams = computed(() => ({
  sort: sort.value,
  type: type.value,
  page: currentPage.value,
  size: pageSize.value,
  search: debouncedSearch.value,
  url: url.value
}))

const { data, status, error, refresh } = useFetch('/api/comment/list', {
  query: queryParams
})

const debouncedRefresh = useDebounceFn(refresh, 300)

whenever(error, () => {
  toastFetchError(error.value!)
})

const focused = useWindowFocus()
whenever(focused, () => refresh())

function handleSelectionChange(selection: any[]) {
  selections.value = selection.map(item => item.id)
}

function renderContentHeader({ column }: any) {
  column.rowSpan = 2
  return column.label
}

function previewComment(id: number) {
  navigateTo({ path: '/', hash: `#comment-${id}` }, { open: { target: '_blank' } })
}

function confirmDelete(ids: number[]) {
  ElMessageBox.confirm(
    'This will permanently delete the comment and its replies. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      const success = await commentStore.deleteComments(ids)

      if (success) {
        tableRef.value?.clearSelection()
        refresh()
      }
    })
    .catch(() => {
      ElMessage.info('Delete canceled')
    })
}
</script>

<style>
.el-table__expanded-cell {
  padding: 0 !important;
}
</style>
