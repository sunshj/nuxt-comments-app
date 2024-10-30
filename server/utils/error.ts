import type { ZodError } from 'zod'

export function createBadRequestError(error: ZodError) {
  return createError({
    statusCode: 400,
    message: 'Bad Request',
    statusMessage: error.errors.map(err => err?.message).join(', ')
  })
}

export function createForbiddenError(message: string) {
  return createError({
    statusCode: 403,
    message: 'Forbidden',
    statusMessage: message
  })
}

export function createUnauthorizedError(message: string) {
  return createError({
    statusCode: 401,
    message: 'Unauthorized',
    statusMessage: message
  })
}
