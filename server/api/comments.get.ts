import { z } from 'zod'

const schema = z.object({
  treeify: z.coerce.boolean().optional().default(false),
  sort: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional()
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { treeify, sort, search } = await getValidatedQuery(event, schema.parse)
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
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
    orderBy: {
      createdAt: sort
    }
  })
  if (!treeify) return comments
  return buildTree(comments, 'id', 'parentId')
})
