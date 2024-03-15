export const omit = <
  T extends {
    [s: string]: unknown
  },
  K extends (keyof T)[],
>(
  obj: T,
  keys: K
): {
  [K2 in Exclude<keyof T, K[number]>]: T[K2]
} =>
  Object.keys(obj)
    .filter((k) => !keys.includes(k))
    .reduce(
      (res, k) => Object.assign(res, { [k]: obj[k] }),
      {} as {
        [R in keyof typeof obj]: (typeof obj)[R]
      }
    )
