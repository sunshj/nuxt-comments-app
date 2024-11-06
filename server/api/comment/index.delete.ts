import { z } from 'zod'

const schema = z.object({
  ids: z.array(z.number())
})

export default defineEventHandler(async event => {
  await requireRoles(event, ['ADMIN'])
  const prisma = usePrisma(event)

  const { ids } = await readValidatedBody(event, schema.parse)
  return prisma.comment.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
})
