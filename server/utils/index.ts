import { createHash } from 'node:crypto'
import { PrismaClient, type Comment, type User } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

export type Serialized<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string
}

export type CommentItem = TreeNode<
  Serialized<Comment, 'createdAt'> & {
    user: Pick<User, 'name' | 'avatarUrl'>
    parent?: { user: Pick<User, 'name'> }
  }
>

export function getGravatarUrl(email: string) {
  const hash = createHash('sha256').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}
