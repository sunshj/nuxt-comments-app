import { like } from 'drizzle-orm'

export default defineEventHandler(event => {
  const db = useDrizzle()
  const { search = '' } = getQuery(event)
  return db
    .select()
    .from(tables.users)
    .where(like(tables.users.name, `%${search}%`))
})
