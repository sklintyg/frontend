import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'

export function MissingEmployeeAssignmentError() {
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitleEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS} </h1>
      <p className="ids-preamble">{ErrorTextEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS}</p>
    </>
  )
}
