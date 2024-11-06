import type { CfProperties, D1Database, ExecutionContext, Request } from '@cloudflare/workers-types'

type AnyString = string & {}

declare global {
  type Role = 'ADMIN' | 'USER' | AnyString
}

interface Env {
  DB: D1Database
}

declare module 'h3' {
  interface H3EventContext {
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}

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
