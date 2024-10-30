import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional()
})

export default defineEventHandler(async event => {
  await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const { error, data } = await readValidatedBody(event, updateUserSchema.safeParse)
  if (error) throw createBadRequestError(error)

  const user = await prisma.user.update({
    where: {
      id: Number(id)
    },

    data
  })

  await replaceUserSession(event, {
    user: {
      id: user.id,
      role: user.role
    },
    loggedInAt: new Date()
  })

  return user
})
