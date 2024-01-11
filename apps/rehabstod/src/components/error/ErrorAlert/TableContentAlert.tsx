import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { ErrorAlert } from './ErrorAlert'

export function TableContentAlert({
  tableName,
  error,
}: {
  tableName: string
  error: (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })
}) {
  const tableErrorTitle = `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} för enheten kunde inte hämtas.`

  const tableErrorDescription = `${
    tableName.charAt(0).toUpperCase() + tableName.slice(1)
  } för enheten kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand `

  return <ErrorAlert heading={tableErrorTitle} errorType="error" text={tableErrorDescription} error={error} dynamicLink />
}
