export function getByType<T extends { type: string }, U extends T['type']>(haystack: T[], needle: U): Extract<T, { type: U }> | undefined {
  return haystack.find(({ type }) => type === needle) as Extract<T, { type: U }> | undefined
}
