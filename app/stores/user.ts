import { defineStore } from 'pinia'
import type { User } from '@prisma/client'
import type { Serialized } from '~~/server/utils'

export type SerializedUser = Serialized<User, 'createdAt' | 'updatedAt'>

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<SerializedUser>()
    const { clear } = useUserSession()

    function setUser(newUser?: SerializedUser) {
      user.value = newUser
    }

    async function login(data: { name: string; email: string }) {
      const user = await $fetch('/api/auth/login', {
        method: 'POST',
        body: data
      }).catch(error => {
        toastFetchError(error)
        return undefined
      })

      setUser(user)
      return user
    }

    async function logout() {
      await clear()
      navigateTo('/login')
    }

    async function updateUser(id: number, data: Partial<SerializedUser>) {
      const user = await $fetch(`/api/user/${id}`, {
        method: 'PUT',
        body: data
      }).catch(error => {
        toastFetchError(error)
        return undefined
      })

      setUser(user)
      return user
    }

    async function deleteUser(id: number) {
      return await $fetch(`/api/user/${id}`, {
        method: 'DELETE'
      }).catch(error => {
        toastFetchError(error)
        return undefined
      })
    }

    return {
      user,
      setUser,
      updateUser,
      deleteUser,
      login,
      logout
    }
  },
  {
    persist: true
  }
)
