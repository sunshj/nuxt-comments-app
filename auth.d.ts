import type { Role } from '@prisma/client'

declare module '#auth-utils' {
  interface User {
    id: number
    role: Role
  }

  interface UserSession {
    loggedInAt: Date
  }
}

export {}
