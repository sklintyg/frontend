export function getByType<T extends { type: string }>(haystack: T[], needle: string): T | undefined {
  return haystack.find(({ type }) => type === needle)
}
