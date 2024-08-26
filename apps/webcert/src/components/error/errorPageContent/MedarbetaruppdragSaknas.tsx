import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const MEDARBETARUPPDRAG_SAKNAS_TITLE = 'Medarbetaruppdrag saknas'
export const MEDARBETARUPPDRAG_SAKNAS_MESSAGE =
  'Det krävs minst ett giltigt medarbetaruppdrag med ändamål "Vård och behandling" för att använda Webcert.'
export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const MedarbetaruppdragSaknas: React.FC = () => {
  return (
    <>
      <p>
        <strong>{MEDARBETARUPPDRAG_SAKNAS_TITLE}</strong>
      </p>
      <p>
        {MEDARBETARUPPDRAG_SAKNAS_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default MedarbetaruppdragSaknas
