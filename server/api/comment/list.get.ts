import { z } from 'zod'
import type { Prisma } from '@prisma/client'

const schema = z.object({
  sort: z.enum(['recent', 'oldest']).optional().default('recent'),
  type: z.enum(['all', 'comment', 'replies']).optional().default('all'),
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(10),
  search: z.string().optional()
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { sort, type, page, size, search } = await getValidatedQuery(event, schema.parse)

  const findManyQuery: Prisma.CommentFindManyArgs = {
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
    where: {
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
    },

    take: size,
    skip: (page - 1) * size,

    orderBy: {
      createdAt: sort === 'oldest' ? 'asc' : 'desc'
    }
  }

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany(findManyQuery),
    prisma.comment.count({ where: findManyQuery.where })
  ])

  return {
    comments,
    total
  }
})
