import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  email: z.string({ required_error: 'Email is required' }).email(),
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
