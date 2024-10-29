export type TreeNode<T, C = any> = T & { children: C[] }
export type ShallowTreeNode<T> = TreeNode<T, T>
export type DeepTreeNode<T> = T & { children: Array<DeepTreeNode<T>> }

interface BuildTreeOptions<T> {
  key: keyof T
  parentKey: keyof T
}

/** @deprecated */
export function buildTree<T extends object>(array: T[], options: BuildTreeOptions<T>) {
  const { key, parentKey } = options
  const tree: Array<DeepTreeNode<T>> = []
  const lookup = new Map<T[keyof T], DeepTreeNode<T>>()

  for (const item of array) {
    lookup.set(item[key], { ...item, children: [] })
  }

  for (const item of array) {
    if (item[parentKey]) {
      const parent = lookup.get(item[parentKey])
      if (parent) {
        parent.children.push(lookup.get(item[key]) as DeepTreeNode<T>)
      }
    } else {
      tree.push(lookup.get(item[key]) as DeepTreeNode<T>)
    }
  }

  return tree
}

export function buildShallowTree<T extends object>(array: T[], options: BuildTreeOptions<T>) {
  const { key, parentKey } = options

  const lookup = new Map<keyof T, ShallowTreeNode<T>>()

  for (const item of array) {
    lookup.set(item[key] as keyof T, { ...item, children: [] })
  }

  function* ancestry(id: keyof T): Generator<keyof T> {
    if (id && lookup.has(id)) {
      yield id
      yield* ancestry(lookup.get(id)![parentKey] as keyof T)
    }
  }

  array.forEach(node => {
    const [ancestor] = [...ancestry(node[parentKey] as keyof T)].reverse()
    if (ancestor && lookup.has(ancestor)) {
      lookup.get(ancestor)!.children.push(lookup.get(node[key] as keyof T)!)
    }
  })

  return Array.from(lookup.values()).filter(node => node[parentKey] === null)
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
