export function sortOnKey<T>(key: keyof T) {
  return (a: T, b: T) => (a[key] > b[key] ? -1 : 1)
}
