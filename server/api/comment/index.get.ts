import { z } from 'zod'

const schema = z.object({
  type: z.enum(['hot', 'recent', 'oldest']).optional().default('recent')
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { type } = await getValidatedQuery(event, schema.parse)

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
