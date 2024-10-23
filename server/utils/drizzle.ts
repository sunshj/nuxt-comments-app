import process from 'node:process'
import { drizzle } from 'drizzle-orm/mysql2'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(process.env.DATABASE_URL as string)
}

export type User = typeof schema.users.$inferSelect
export type Comment = typeof schema.comments.$inferSelect
