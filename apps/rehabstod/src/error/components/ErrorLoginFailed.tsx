import { ErrorText, ErrorTitle } from '../ErrorCode'

export function ErrorLoginFailed() {
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitle.LOGIN_FAILED} </h1>
      <p className="ids-preamble">{ErrorText.LOGIN_FAILED}</p>
    </>
  )
}
