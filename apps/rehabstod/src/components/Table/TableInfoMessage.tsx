import { IDSSpinner } from '@frontend/ids-react-ts'
import { MaxColspanRow } from './tableBody/MaxColspanRow'
import type { User } from '../../schemas'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from './utils/tableTextGeneratorUtils'
import { isUserDoctor } from '../../utils/isUserDoctor'

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
