export default defineEventHandler(async event => {
  const db = useDrizzle()
  const { userId, parentId, content } = await readBody(event)

  return await db.insert(tables.comments).values({
    userId,
    parentId,
    content
  })
})
