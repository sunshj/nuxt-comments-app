import { defineStore } from 'pinia'
import type { User } from '@prisma/client'
import type { WithSerializedDates } from '~~/server/utils'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<WithSerializedDates<User>>()

    function setUser(newUser: WithSerializedDates<User>) {
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
