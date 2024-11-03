import { z } from 'zod'

const schema = z.object({
  url: z.string().min(1),
  type: z.enum(['hot', 'recent', 'oldest']).optional().default('recent')
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { type, url } = await getValidatedQuery(event, schema.parse)

  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true
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
      url
    }
  })

  const commentsTree = buildShallowTree(comments, {
    key: 'id',
    parentKey: 'parentId'
  }).sort((a, b) => {
    if (type === 'hot') return b.children.length - a.children.length
    if (type === 'oldest') return a.id - b.id
    return b.id - a.id
  })

  return {
    total: countTreeNodes(commentsTree),
    comments: commentsTree
  }
})
