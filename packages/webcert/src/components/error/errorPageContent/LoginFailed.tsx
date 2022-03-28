import React from 'react'

const LoginFailed: React.FC = () => {
  return (
    <>
      <p>
        <strong>Inloggningen misslyckades</strong>
      </p>
      <p>
        Detta kan bero på att du saknar behörighet till Webcert eller att du saknar giltigt medarbetaruppdrag med ändamål "Vård och
        behandling"
      </p>
    </>
  )
}

export default LoginFailed
