import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { H3Event } from 'h3'

export function usePrisma(event: H3Event) {
  const { cloudflare } = event.context
  const d1Client = cloudflare.env.DB
  const adapter = new PrismaD1(d1Client)
  return new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
    omit: {
      user: {
        password: true
      }
    }
  })
}
