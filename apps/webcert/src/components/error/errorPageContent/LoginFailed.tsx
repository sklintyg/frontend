import type React from 'react'

export const LOGIN_FAILED_TITLE = 'Inloggningen misslyckades'
export const LOGIN_FAILED_MESSAGE =
  'Detta kan bero på att du saknar behörighet till Webcert eller att du saknar giltigt medarbetaruppdrag med ändamål "Vård och behandling"'

const LoginFailed: React.FC = () => {
  return (
    <>
      <p>
        <strong>{LOGIN_FAILED_TITLE}</strong>
      </p>
      <p>{LOGIN_FAILED_MESSAGE}</p>
    </>
  )
}

export default LoginFailed
