import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_TITLE = 'Behörighet saknas'
export const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_MESSAGE =
  'För att hantera intyg för patienter med skyddade personuppgifter krävs att du har befattningen läkare eller tandläkare. ' +
  'Vissa intygstyper får inte hanteras alls för patienter med skyddade personuppgifter, även om du har befattningen som krävs.'

export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const AuthorizationProblemConfidentialityMarking: React.FC = () => {
  return (
    <>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_TITLE}</strong>
      </p>
      <p>
        {AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default AuthorizationProblemConfidentialityMarking
