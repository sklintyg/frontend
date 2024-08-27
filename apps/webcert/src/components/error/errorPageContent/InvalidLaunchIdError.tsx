import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const INVALID_LAUNCHID_TITLE = 'Intyget kan inte visas'
export const INVALID_LAUNCHID_MESSAGE = 'Detta intyg kan inte visas eftersom du har öppnat ett annat intyg.'
export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const InvalidLaunchIdError: React.FC = () => {
  return (
    <>
      <p>
        <strong>{INVALID_LAUNCHID_TITLE}</strong>
      </p>
      <p>
        {INVALID_LAUNCHID_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default InvalidLaunchIdError
