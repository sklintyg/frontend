import { ErrorText, ErrorTitle } from '../ErrorCode'

export function ErrorHsaMissingRole() {
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitle.LOGIN_SAKNAR_HSA_REHABROLL} </h1>
      <p className="ids-preamble">{ErrorText.LOGIN_SAKNAR_HSA_REHABROLL}</p>
    </>
  )
}
