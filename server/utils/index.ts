import { createHash } from 'node:crypto'
import type { Comment, User } from '@prisma/client'

export type TreeItem<T> = T & { children?: Array<TreeItem<T>> }

export function buildTree<T extends object, K extends keyof T, P extends keyof T>(
  array: T[],
  key: K,
  parentKey: P
) {
  const tree: Array<TreeItem<T>> = []
  const lookup: Record<string, TreeItem<T>> = {}

  // Build a lookup table
  for (const item of array) {
    lookup[item[key] as string] = { ...item, children: [] }
  }

  // Build the tree structure
  for (const item of array) {
    if (item[parentKey]) {
      const parent = lookup[item[parentKey] as string]
      if (parent) {
        parent.children?.push(lookup[item[key] as string])
      }
    } else {
      tree.push(lookup[item[key] as string])
    }
  }

  return tree
}

export type WithSerializedDates<T> = T extends Date
  ? string
  : T extends Array<infer R>
    ? Array<WithSerializedDates<R>>
    : T extends object
      ? { [K in keyof T]: WithSerializedDates<T[K]> }
      : T

export type CommentItem = WithSerializedDates<TreeItem<Comment & { user: Omit<User, 'createdAt'> }>>

export function getGravatarUrl(email: string) {
  const hash = createHash('sha256').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}
