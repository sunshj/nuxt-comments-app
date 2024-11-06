import { objectOmit } from '@vueuse/core'
import { z } from 'zod'

const schema = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'Password is required' }).min(6)
})

export default defineEventHandler(async event => {
  const { error, data } = await readValidatedBody(event, schema.safeParse)

  if (error) throw createBadRequestError(error)
  const { email, password } = data

  const prisma = usePrisma(event)
  const user = await prisma.user.findUnique({
    where: { email },
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
