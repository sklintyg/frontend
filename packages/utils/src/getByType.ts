type ExtractByType<T, U> = T extends { type: U } ? T : never

export function getByType<T extends { type: string }, U extends T['type']>(haystack: T[], needle: U): ExtractByType<T, U> | undefined {
  return haystack.find((item): item is ExtractByType<T, U> => item.type === needle)
}
