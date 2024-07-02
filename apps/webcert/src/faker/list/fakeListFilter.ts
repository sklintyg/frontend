import type { ListFilter } from '../../types'
import { ListType } from '../../types'

export function fakeListFilter(data?: Partial<ListFilter>): ListFilter {
  return { type: ListType.UNKOWN, values: {}, ...data }
}
