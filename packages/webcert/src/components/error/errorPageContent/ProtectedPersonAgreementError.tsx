import React from 'react'
import { InfoBox } from '@frontend/common/src'

const ProtectedPersonAgreementError: React.FC = () => {
  return (
    <>
      <p>
        <strong>Godkännande saknas</strong>
      </p>
      <p>Användarvillkoren för användning av Webcert med skyddade personuppgifter har inte godkänts. Webcert har avslutats.</p>
    </>
  )
}

export default ProtectedPersonAgreementError
