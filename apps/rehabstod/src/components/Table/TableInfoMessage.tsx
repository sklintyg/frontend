import { IDSSpinner } from '@inera/ids-react'
import type { User } from '../../schemas'
import { isUserDoctor } from '../../utils/isUserDoctor'
import { MaxColspanRow } from './tableBody/MaxColspanRow'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from './utils/tableTextGeneratorUtils'

export function TableInfoMessage<T>({
  isLoading,
  tableLength,
  tableName,
  suffix,
  user,
  content,
  hasAppliedFilters,
}: {
  isLoading: boolean
  tableLength: number
  tableName: string
  suffix?: string
  user?: User
  content: T[] | null
  hasAppliedFilters: boolean
}) {
  const getContent = () => {
    if (isLoading) {
      return <IDSSpinner data-testid="spinner" />
    }

    if (content === null) {
      return user ? getSearchText(isUserDoctor(user), tableName, suffix) : ''
    }

    if (content.length === 0) {
      return hasAppliedFilters ? getEmptyFiltrationText(tableName) : getEmptyTableText(user, tableName)
    }

    return null
  }

  return getContent() !== null ? (
    <tbody>
      <MaxColspanRow colspan={tableLength}>{getContent()}</MaxColspanRow>
    </tbody>
  ) : null
}
