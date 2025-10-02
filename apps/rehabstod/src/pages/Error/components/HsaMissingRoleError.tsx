import { Heading } from '../../../components/Heading/Heading'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function MissingHsaRoleError() {
  useLogErrorEffect({ message: 'login.saknar-hsa-rehabroll', errorCode: ErrorCode.LOGIN_SAKNAR_HSA_REHABROLL })

  return (
    <>
      <Heading level={1} size="l">
        Behörighet saknas
      </Heading>
      <p className="ids-preamble">
        För att logga in som Rehabkoordinator krävs att du har den rollen för vårdenheten i HSA. Kontakta din lokala HSA-administratör för
        behörighet.
      </p>
    </>
  )
}
