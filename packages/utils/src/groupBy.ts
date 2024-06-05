export function groupBy<T extends object>(arr: T[], callback: (item: T) => string | number | { toString: () => string }) {
  return [...arr].reduce<Record<string, T[]>>((result, item) => {
    const key = callback(item).toString()
    const hasProp = Object.prototype.hasOwnProperty.call(result, key)
    return { ...result, [key]: [...(hasProp ? result[key] : []), item] }
  }, {})
}
