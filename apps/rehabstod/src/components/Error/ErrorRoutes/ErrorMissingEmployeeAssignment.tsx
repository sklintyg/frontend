import { ErrorText, ErrorTitle } from '../ErrorCode'

export function ErrorMissingEmployeeAssignment() {
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitle.LOGIN_MEDARBETARUPPDRAG_SAKNAS} </h1>
      <p className="ids-preamble">{ErrorText.LOGIN_MEDARBETARUPPDRAG_SAKNAS}</p>
    </>
  )
}
