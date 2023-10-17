export function tryCatch<T>(f: () => T): [T | undefined, unknown] {
  try {
    return [f(), undefined]
  } catch (error) {
    return [undefined, error]
  }
}
