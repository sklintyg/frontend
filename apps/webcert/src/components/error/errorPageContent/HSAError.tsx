import WCDynamicLink from '../../../utils/WCDynamicLink'
import type React from 'react'
import { Link } from 'react-router-dom'

export const TITLE = 'Tekniskt fel'
export const MESSAGE = (
  <span>
    Tyvärr har ett tekniskt problem uppstått i Webcert. <Link to="/">Försök gärna igen</Link> för att se om felet är tillfälligt.
  </span>
)
export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const HSAError: React.FC = () => {
  return (
    <>
      <p>
        <strong>{TITLE}</strong>
      </p>
      <p>
        {MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default HSAError
