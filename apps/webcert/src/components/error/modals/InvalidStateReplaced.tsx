import type { ModalProps } from './errorUtils'
import type React from 'react'
import ErrorModalBase from './ErrorModalBase'

export const INVALID_STATE_TITLE = 'Funktionen är inte giltig'
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
