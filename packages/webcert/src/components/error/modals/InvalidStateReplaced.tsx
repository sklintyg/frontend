import { ModalProps } from './ModalUtils'
import React from 'react'
import ErrorModalBase from './ErrorModalBase'

const INVALID_STATE_REPLACED_MESSAGE = 'Intyget kunde inte förnyas eftersom det har blivit ersatt av ett senare intyg.'

const InvalidStateReplaced: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>{INVALID_STATE_REPLACED_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default InvalidStateReplaced
