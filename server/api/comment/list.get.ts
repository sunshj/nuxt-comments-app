import { z } from 'zod'

const schema = z.object({
  sort: z.enum(['recent', 'oldest']).optional().default('recent'),
  type: z.enum(['all', 'comment', 'replies']).optional().default('all'),
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(10),
  search: z.string().optional().default('')
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { sort, type, page, size, search } = await getValidatedQuery(event, schema.parse)

  const where = {
    ...(type === 'comment'
      ? { parentId: null }
      : type === 'replies'
        ? { parentId: { not: null } }
        : {}),

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

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        },
        parent: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      where,

      take: size,
      skip: (page - 1) * size,

      orderBy: {
        createdAt: sort === 'oldest' ? 'asc' : 'desc'
      }
    }),
    prisma.comment.count({ where })
  ])

  return {
    comments,
    total
  }
})
