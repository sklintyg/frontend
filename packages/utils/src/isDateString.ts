import { isString } from './isString'

export function isDateString(val: unknown): val is string {
  return val != null && isString(val) && Boolean(val.match(/\d{4}-\d{2}-\d{2}/))
}
