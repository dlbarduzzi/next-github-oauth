export type DatabaseSuccess<T> = {
  ok: true
  data: T
}

export type DatabaseFailure = {
  ok: false
  error: string
}
