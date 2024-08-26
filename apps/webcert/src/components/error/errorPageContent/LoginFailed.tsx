import type React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const LOGIN_FAILED_TITLE = 'Inloggningen misslyckades'
export const LOGIN_FAILED_MESSAGE =
  'Detta kan bero på att du saknar behörighet till Webcert eller att du saknar giltigt medarbetaruppdrag med ändamål "Vård och behandling"'
export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const LoginFailed: React.FC = () => {
  return (
    <>
      <p>
        <strong>{LOGIN_FAILED_TITLE}</strong>
      </p>
      <p>
        {LOGIN_FAILED_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default LoginFailed
