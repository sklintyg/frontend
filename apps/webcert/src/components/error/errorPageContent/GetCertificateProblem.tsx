import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const GET_CERTIFICATE_PROBLEM_TITLE = 'Intyget kunde inte visas'
export const GET_CERTIFICATE_PROBLEM_TEXT = 'Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand '

const InternalProblem: React.FC = () => {
  return (
    <>
      <p>
        <strong>{GET_CERTIFICATE_PROBLEM_TITLE}</strong>
      </p>
      <p>
        {GET_CERTIFICATE_PROBLEM_TEXT} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />
      </p>
    </>
  )
}

export default InternalProblem
