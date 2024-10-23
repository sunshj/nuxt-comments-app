export type TreeItem<T> = T & { children?: Array<TreeItem<T>> }

export function toTree<T extends object, K extends keyof T, P extends keyof T>(
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
