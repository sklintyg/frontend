import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { ErrorAlert } from '../ErrorAlert/ErrorAlert'
import { getTableErrorDescription, getTableErrorTitle } from '../../Table/utils/tableTextGeneratorUtils'

export function GetTableContentError({
  tableName,
  error,
}: {
  tableName: string
  error: (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })
}) {
  return (
    <ErrorAlert
      heading={getTableErrorTitle(tableName)}
      errorType="error"
      text={getTableErrorDescription(tableName)}
      error={error}
      dynamicLink
    />
  )
}
