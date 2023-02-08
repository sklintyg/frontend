import React from 'react'
import ErrorModalBase from './ErrorModalBase'
import { ModalProps } from './errorUtils'
import { INVALID_STATE_TITLE } from './InvalidState'

export const INVALID_STATE_REPLACED_MESSAGE = 'Intyget har blivit ersatt av ett senare intyg.'

const InvalidStateReplaced: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{INVALID_STATE_TITLE}</strong>
      </p>
      <p>{INVALID_STATE_REPLACED_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default InvalidStateReplaced
