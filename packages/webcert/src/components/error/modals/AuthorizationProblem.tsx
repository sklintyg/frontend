import { ModalProps } from './ModalUtils'
import React from 'react'
import ErrorModalBase from './ErrorModalBase'

const AUTHORIZATION_PROBLEM_TITLE = 'Behörighet saknas.'
const AUTHORIZATION_PROBLEM_MESSAGE = 'Du saknar behörighet att använda denna resurs.'
const AUTHORIZATION_PROBLEM_MESSAGE_2 = 'Du har inte behörighet att utföra funktionen, kontakta supporten för mer information.'

const AuthorizationProblem: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_TITLE}</strong>
      </p>
      <p>{AUTHORIZATION_PROBLEM_MESSAGE}</p>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_MESSAGE_2}</strong>
      </p>
    </ErrorModalBase>
  )
}

export default AuthorizationProblem
