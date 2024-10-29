export type TreeNode<T> = T & { children: Array<TreeNode<T>> }

interface BuildTreeOptions<T> {
  key: keyof T
  parentKey: keyof T
}

/** @deprecated */
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

export function buildShallowTree<T extends object>(
  array: T[],
  { key, parentKey }: BuildTreeOptions<T>
): Array<TreeNode<T>> {
  const lookup: Record<keyof T, TreeNode<T>> = Object.fromEntries(
    array.map(node => [node[key], { ...node, children: [] }])
  )

  function* ancestry(id: keyof T): Generator<PropertyKey> {
    if (id) {
      yield id
      if (lookup[id]) {
        yield* ancestry(lookup[id][parentKey] as keyof T)
      }
    }
  }
  array.forEach(node => {
    const ancestors = [...ancestry(node[parentKey] as keyof T)]
    const ancestor = ancestors.length > 0 ? (ancestors.at(-1) as keyof T) : null
    if (ancestor && lookup[ancestor]) {
      lookup[ancestor].children.push(lookup[node[key] as keyof T])
    }
  })

  return Object.values<TreeNode<T>>(lookup).filter(node => node[parentKey] === null)
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

export function sortTree<T>(nodes: Array<TreeNode<T>>) {
  // TODO: Need implement
  return nodes
}
