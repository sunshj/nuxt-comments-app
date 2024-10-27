import { z } from 'zod'

const schema = z.object({
  type: z.enum(['recent', 'oldest']).optional().default('recent'),
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(10),
  search: z.string().optional()
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { type, page, size, search } = await getValidatedQuery(event, schema.parse)

  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true
        }
      },
      reply: {
        select: {
          name: true
        }
      }
    },
    where: {
      OR: [
        {
          content: {
            contains: search
          }
        },
        {
          user: {
            name: {
              contains: search
            }
          }
        },
        {
          user: {
            email: {
              contains: search
            }
          }
        }
      ]
    },

    take: size,
    skip: (page - 1) * size,

    orderBy: {
      createdAt: type === 'oldest' ? 'asc' : 'desc'
    }
  })

  const total = await prisma.comment.count({
    where: {
      OR: [
        {
          content: {
            contains: search
          }
        },
        {
          user: {
            name: {
              contains: search
            }
          }
        },
        {
          user: {
            email: {
              contains: search
            }
          }
        }
      ]
    }
  })

  return {
    comments,
    total
  }
})
