<template>
  <div class="w-full flex flex-col gap-4 rounded-xl bg-white p-4">
    <ElForm inline class="w-full">
      <ElFormItem label="筛选" class="min-w-1/4">
        <ElInput v-model="search" clearable placeholder="search name, email." />
      </ElFormItem>

      <ElFormItem>
        <ElButton native-type="button" type="primary" @click="debouncedRefresh()"> 刷新 </ElButton>
      </ElFormItem>
    </ElForm>

    <ClientOnly>
      <ElTable
        v-loading="status === 'pending'"
        stripe
        border
        :data="data?.users"
        style="width: 100%"
      >
        <ElTableColumn prop="id" label="ID" width="80" />
        <ElTableColumn prop="name" label="name" width="120" />
        <ElTableColumn label="avatar" width="100">
          <template #default="{ row }">
            <ElAvatar :src="row.avatarUrl" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="email" label="email" width="180" />
        <ElTableColumn label="role" width="100">
          <template #default="{ row }">
            <ElTag v-if="row.role === 'ADMIN'" type="warning">{{ row.role }}</ElTag>
            <ElTag v-else type="info">{{ row.role }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="createdAt">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="updatedAt">
          <template #default="{ row }">
            {{ formatTime(row.updatedAt) }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="Operations" width="200">
          <template #default="{ row }">
            <ElButton size="small" @click="showEditDialog(row.id)"> Edit </ElButton>
            <ElButton type="danger" size="small" @click="confirmDelete(row.id)"> Delete </ElButton>
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
useServerHead({
  title: 'Dashboard'
})

definePageMeta({
  layout: 'dashboard',
  roles: ['ADMIN'],
  menuConfig: {
    title: 'Users',
    order: 1
  }
})

const userStore = useUserStore()

const currentPage = ref(1)
const pageSize = ref(10)

const search = ref('')
const debouncedSearch = refDebounced(search, 300)

const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  search: debouncedSearch.value
}))

const { data, error, status, refresh } = useFetch('/api/user', {
  query: queryParams
})

const debouncedRefresh = useDebounceFn(refresh, 300)

watchEffect(() => {
  if (error.value) {
    toastFetchError(error.value)
  }
})

function showEditDialog(id: number) {
  console.log(id)
  ElMessage.warning('not implement')
}

function confirmDelete(id: number) {
  ElMessageBox.confirm(
    'This will permanently delete the user and its comments. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      const success = await userStore.deleteUser(id)

      if (success) {
        refresh()
      }
    })
    .catch(() => {
      ElMessage.info('Delete canceled')
    })
}
</script>
