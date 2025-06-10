import { Heading } from '../../../components/Heading/Heading'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function MissingEmployeeAssignmentError() {
  useLogErrorEffect({ message: 'login.medarbetaruppdrag', errorCode: ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS })

  return (
    <>
      <Heading level={1} size="xxl">
        Medarbetaruppdrag saknas
      </Heading>
      <p className="ids-preamble">
        Det krävs minst ett giltigt medarbetaruppdrag med ändamål <q>Vård och behandling</q> för att använda Rehabstöd.{' '}
      </p>
    </>
  )
}
