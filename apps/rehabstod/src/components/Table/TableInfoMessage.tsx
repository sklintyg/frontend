import { IDSSpinner } from '@frontend/ids-react-ts'
import { MaxColspanRow } from './MaxColspanRow'

export function TableInfoMessage<T>({
  isLoading,
  tableLength,
  searchText,
  emptyTableFromFiltrationText,
  emptyTableText,
  content,
  hasAppliedFilters,
}: {
  isLoading: boolean
  tableLength: number
  searchText: string
  emptyTableFromFiltrationText: string
  emptyTableText: string
  content: T[] | null
  hasAppliedFilters: boolean
}) {
  if (isLoading) {
    return (
      <MaxColspanRow colspan={tableLength}>
        <IDSSpinner />
      </MaxColspanRow>
    )
  }

  if (content === null) {
    return <MaxColspanRow colspan={tableLength}>{searchText}</MaxColspanRow>
  }

  if (content.length === 0) {
    if (hasAppliedFilters) {
      return <MaxColspanRow colspan={tableLength}>{emptyTableFromFiltrationText}</MaxColspanRow>
    }

    return <MaxColspanRow colspan={tableLength}>{emptyTableText}</MaxColspanRow>
  }
}
