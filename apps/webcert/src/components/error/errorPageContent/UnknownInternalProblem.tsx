import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Intyget kunde inte visas'
export const UNKNOWN_INTERNAL_PROBLEM_MESSAGE = 'Prova att ladda om sidan.'

export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const UnknownInternalProblem: React.FC = () => {
  return (
    <>
      <p>
        <strong>{UNKNOWN_INTERNAL_PROBLEM_TITLE}</strong>
      </p>
      <p>
        {UNKNOWN_INTERNAL_PROBLEM_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default UnknownInternalProblem
