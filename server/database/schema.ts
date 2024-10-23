import { sql } from 'drizzle-orm'
import { int, mysqlTable, text, timestamp } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
})

export const comments = mysqlTable('comments', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  parentId: int('parent_id'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
})
