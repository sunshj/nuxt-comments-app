import { defineStore } from 'pinia'
import type { User } from '@prisma/client'
import type { SerializedDate } from '~~/server/utils'

export type SerializedUser = SerializedDate<User, 'createdAt' | 'updatedAt'>

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<SerializedUser>()

    function setUser(newUser: SerializedUser) {
      user.value = newUser
    }

    async function login(data: { name: string; email: string }) {
      const user = await $fetch('/api/auth/login', {
        method: 'POST',
        body: data
      })

      setUser(user)
      return user
    }

    return {
      user,
      login
    }
  },
  {
    persist: true
  }
)
