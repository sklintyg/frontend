import { SortDirection } from './types/SortDirection'

export const sortBy =
  <T>(order: SortDirection, callback: (arg: T) => number) =>
  (a: T, b: T) =>
    order === 'ascending' ? callback(a) - callback(b) : callback(b) - callback(a)
