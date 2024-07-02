import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import { ErrorAlert } from './ErrorAlert'

export function PatientTableError({ error }: { error: (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string }) }) {
  return (
    <ErrorAlert
      heading="Tekniskt fel"
      errorType="error"
      text="Information kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand"
      error={error}
      dynamicLink
    />
  )
}
