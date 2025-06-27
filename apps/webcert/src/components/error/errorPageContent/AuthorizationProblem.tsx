import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const AUTHORIZATION_PROBLEM_TITLE = 'Behörighet saknas'
export const AUTHORIZATION_PROBLEM_MESSAGE =
  'Du saknar behörighet för att komma åt intyget. För att få hjälp, kontakta i första hand din lokala IT-avdelning och i andra hand '

const AuthorizationProblem = () => {
  return (
    <>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_TITLE}</strong>
      </p>
      <p>
        {AUTHORIZATION_PROBLEM_MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
      </p>
    </>
  )
}

export default AuthorizationProblem
