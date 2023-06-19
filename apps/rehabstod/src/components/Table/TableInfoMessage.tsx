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
  const getContent = () => {
    if (isLoading) {
      return <IDSSpinner />
    }

    if (content === null) {
      return searchText
    }

    if (content.length === 0) {
      return hasAppliedFilters ? emptyTableFromFiltrationText : emptyTableText
    }

    return null
  }

  return getContent() !== null ? (
    <tbody>
      <MaxColspanRow colspan={tableLength}>{getContent()}</MaxColspanRow>
    </tbody>
  ) : null
}
