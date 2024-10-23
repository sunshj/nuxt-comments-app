import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDrizzle()
  const comments = await db
    .select({
      comment: tables.comments,
      user: {
        id: tables.users.id,
        name: tables.users.name,
        avatar: tables.users.avatar
      }
    })
    .from(tables.comments)
    .leftJoin(tables.users, eq(tables.comments.userId, tables.users.id))
    .orderBy(desc(tables.comments.createdAt))

  if (!comments?.length) return []
  const flattenComments = comments.map(({ comment, user }) => ({ ...comment, user })) ?? []

  const result = toTree(flattenComments, 'id', 'parentId')
  return result
})
