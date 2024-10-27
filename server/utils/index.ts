import { createHash } from 'node:crypto'
import type { Comment, User } from '@prisma/client'

export type TreeNode<T> = T & { children: Array<TreeNode<T>> }

interface BuildTreeOptions<T> {
  key: keyof T
  parentKey: keyof T
}

export function buildTree<T extends object>(array: T[], options: BuildTreeOptions<T>) {
  const { key, parentKey } = options
  const tree: Array<TreeNode<T>> = []
  const lookup = new Map<T[keyof T], TreeNode<T>>()

  for (const item of array) {
    lookup.set(item[key], { ...item, children: [] })
  }

  for (const item of array) {
    if (item[parentKey]) {
      const parent = lookup.get(item[parentKey])
      if (parent) {
        parent.children.push(lookup.get(item[key]) as TreeNode<T>)
      }
    } else {
      tree.push(lookup.get(item[key]) as TreeNode<T>)
    }
  }

  return tree
}

export function countTreeNodes<T>(nodes: Array<TreeNode<T>>): number {
  let count = 0

  const traverse = (node: TreeNode<T>) => {
    count++
    for (const child of node.children) {
      traverse(child)
    }
  }

  for (const node of nodes) {
    traverse(node)
  }

  return count
}

export type Serialized<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string
}

export type CommentItem = TreeNode<
  Serialized<Comment, 'createdAt'> & {
    user: Pick<User, 'name' | 'avatarUrl'>
    reply?: Pick<User, 'name'>
  }
>

export function getGravatarUrl(email: string) {
  const hash = createHash('sha256').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}
