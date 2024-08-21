import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const INTERNAL_PROBLEM_TITLE = 'Intyget kunde inte visas'
export const INTERNAL_PROBLEM_MESSAGE =
  'Prova att ladda om sidan. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand '

const InternalProblem: React.FC = () => {
  return (
    <>
      <p>
        <strong>{INTERNAL_PROBLEM_TITLE}</strong>
      </p>
      <p>
        {INTERNAL_PROBLEM_MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />
      </p>
    </>
  )
}

export default InternalProblem
