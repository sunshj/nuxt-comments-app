import { z } from 'zod'

const schema = z.object({
  ids: z.array(z.number())
})

export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event)
  if (user.role !== 'ADMIN') throw createForbiddenError('You are not authorized to delete comments')

  const { ids } = await readValidatedBody(event, schema.parse)
  return prisma.comment.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
})
