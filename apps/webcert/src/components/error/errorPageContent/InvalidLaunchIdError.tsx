import type React from 'react'

export const INVALID_LAUNCHID_TITLE = 'Intyget kan inte visas'
export const INVALID_LAUNCHID_MESSAGE = 'Detta intyg kan inte visas eftersom du har öppnat ett annat intyg.'

const InvalidLaunchIdError: React.FC = () => {
  return (
    <>
      <p>
        <strong>{INVALID_LAUNCHID_TITLE}</strong>
      </p>
      <p>{INVALID_LAUNCHID_MESSAGE}</p>
    </>
  )
}

export default InvalidLaunchIdError
