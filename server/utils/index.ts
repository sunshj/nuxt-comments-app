import { createHash } from 'node:crypto'
import type { Comment, User } from '@prisma/client'
import type { H3Event } from 'h3'

export type Serialized<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string
}

export type CommentItem = DeepTreeNode<
  Serialized<Comment, 'createdAt'> & {
    user: Pick<User, 'name' | 'avatarUrl'>
    parent?: { user: Pick<User, 'name'> }
  }
>

export function getGravatarUrl(email: string) {
  const hash = createHash('sha256').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}

export async function requireRoles(event: H3Event, roles: Role[]) {
  const { user } = await requireUserSession(event)
  if (!roles.includes(user.role)) {
    throw createForbiddenError('You do not have permission to perform this action')
  }
  return user
}
