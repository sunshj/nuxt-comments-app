import { createHash } from 'node:crypto'
import type { Comment, User } from '@prisma/client'

export type TreeItem<T> = T & { children: Array<TreeItem<T>> }

interface BuildTreeOptions<T> {
  key: keyof T
  parentKey: keyof T
}

export function buildTree<T extends object>(array: T[], options: BuildTreeOptions<T>) {
  const { key, parentKey } = options
  const tree: Array<TreeItem<T>> = []
  const lookup = new Map<T[keyof T], TreeItem<T>>()

  for (const item of array) {
    lookup.set(item[key], { ...item, children: [] })
  }

  for (const item of array) {
    if (item[parentKey]) {
      const parent = lookup.get(item[parentKey])
      if (parent) {
        parent.children.push(lookup.get(item[key]) as TreeItem<T>)
      }
    } else {
      tree.push(lookup.get(item[key]) as TreeItem<T>)
    }
  }

  return tree
}

export function countTreeItems<T>(tree: T[], key: keyof T): number {
  return tree.reduce((count, item) => count + 1 + countTreeItems(item[key] as T[], key), 0)
}

export type Serialized<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string
}

export type CommentItem = TreeItem<
  Serialized<Comment, 'createdAt'> & {
    user: Pick<User, 'name' | 'avatarUrl'>
    reply?: Pick<User, 'name'>
  }
>

export function getGravatarUrl(email: string) {
  const hash = createHash('sha256').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}
