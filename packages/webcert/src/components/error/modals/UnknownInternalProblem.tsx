import { ModalProps } from './ModalUtils'
import ErrorModalBase from './ErrorModalBase'
import React from 'react'

const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Ett tekniskt problem inträffade.'
const UNKNOWN_INTERNAL_PROBLEM_MESSAGE = 'Försök igen och kontakta supporten om problemet kvarstår.'

const UnknownInternalProblem: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{UNKNOWN_INTERNAL_PROBLEM_TITLE}</strong>
      </p>
      <p>{UNKNOWN_INTERNAL_PROBLEM_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default UnknownInternalProblem
