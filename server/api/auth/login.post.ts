import { objectOmit } from '@vueuse/core'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  password: z.string({ required_error: 'Password is required' }).min(6)
})

export default defineEventHandler(async event => {
  const { error, data } = await readValidatedBody(event, createUserSchema.safeParse)

  if (error) throw createBadRequestError(error)
  const { name, password } = data

  const user = await prisma.user.findUnique({
    where: { name },
    omit: {
      password: false
    }
  })
  if (!user) throw createUnauthorizedError('User not found')
  const verified = await verifyPassword(user.password, password)
  if (!verified) throw createUnauthorizedError('Password is incorrect')

  await setUserSession(event, {
    user: {
      id: user.id,
      role: user.role
    },
    loggedInAt: new Date()
  })

  return objectOmit(user, ['password'])
})
