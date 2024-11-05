import type { Role } from '@prisma/client'

declare module '#app' {
  interface PageMeta {
    /** dashboard menu config  */
    menu?: {
      title: string
      order?: number
    }
    /** dashboard roles */
    roles?: Role[]
  }
}

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
