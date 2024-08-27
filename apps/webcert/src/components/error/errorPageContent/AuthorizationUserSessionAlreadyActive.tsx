import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_TITLE = 'Intyget kunde inte visas'
export const AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_MESSAGE =
  'Ett problem med sessionen för Webcert har uppstått. Stäng de fönster eller flikar som är öppnade sedan tidigare och försök igen.'
export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const AuthorizationUserSessionAlreadyActive: React.FC = () => {
  return (
    <>
      <p>
        <strong>{AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_TITLE}</strong>
      </p>
      <p>
        {AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default AuthorizationUserSessionAlreadyActive
