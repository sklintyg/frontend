import React from 'react'

export const TIMEOUT_TITLE = 'Intyget kan inte visas'
export const TIMEOUT_MESSAGE = 'Detta intyg kan inte visas eftersom du har öppnat ett annat intyg.'

const InvalidLaunchIdError: React.FC = () => {
  return (
    <>
      <p>
        <strong>{TIMEOUT_TITLE}</strong>
      </p>
      <p>{TIMEOUT_MESSAGE}</p>
    </>
  )
}

export default InvalidLaunchIdError
