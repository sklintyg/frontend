import type React from 'react'

export const AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_TITLE = 'This user session is already active and using Webcert'
export const AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_MESSAGE = 'Please use a new user session for each deep integration link'

const AuthorizationUserSessionAlreadyActive: React.FC = () => {
  return (
    <>
      <p>
        <strong>{AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_TITLE}</strong>
      </p>
      <p>{AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE_MESSAGE}</p>
    </>
  )
}

export default AuthorizationUserSessionAlreadyActive
