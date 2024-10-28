import type { FetchError } from 'ofetch'

export function toastFetchError(error: FetchError) {
  const { data, statusMessage, message, statusCode } = error
  ElMessage.error(data?.statusMessage || statusMessage || message || statusCode)
}
