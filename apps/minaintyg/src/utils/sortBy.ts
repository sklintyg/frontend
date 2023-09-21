import { SortDirection } from 'react-stately'

export const sortBy =
  <T>(order: SortDirection, callback: (arg: T) => number) =>
  (a: T, b: T) =>
    order === 'ascending' ? callback(a) - callback(b) : callback(b) - callback(a)
