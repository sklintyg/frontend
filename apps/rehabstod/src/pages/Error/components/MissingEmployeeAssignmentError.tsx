import { ErrorCode } from '../../../schemas/errorSchema'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function MissingEmployeeAssignmentError() {
  useLogErrorEffect({ message: 'login.medarbetaruppdrag', errorCode: ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS })

  return (
    <>
      <h1 className="ids-heading-1">Medarbetaruppdrag saknas</h1>
      <p className="ids-preamble">
        Det krävs minst ett giltigt medarbetaruppdrag med ändamål <q>Vård och behandling</q> för att använda Rehabstöd.{' '}
      </p>
    </>
  )
}
