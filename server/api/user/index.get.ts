import { z } from 'zod'

const schema = z.object({
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(10),
  search: z.string().optional()
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { page, size, search } = await getValidatedQuery(event, schema.parse)

  const where = {
    OR: [
      {
        name: {
          contains: search
        }
      },
      {
        email: {
          contains: search
        }
      }
    ]
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,

      take: size,
      skip: (page - 1) * size,

      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count({ where })
  ])

  return {
    users,
    total
  }
})
