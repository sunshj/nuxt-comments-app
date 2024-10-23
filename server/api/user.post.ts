export default defineEventHandler(async event => {
  const db = useDrizzle()
  const body = await readBody(event)
  const { name, avatar = 'unknown.png' } = body
  return await db
    .insert(tables.users)
    .values({
      name,
      avatar
    })
    .$returningId()
})
