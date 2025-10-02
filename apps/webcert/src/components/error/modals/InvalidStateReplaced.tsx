import ErrorModalBase from './ErrorModalBase'
import type { ModalProps } from './errorUtils'

export const INVALID_STATE_TITLE = 'Funktionen är inte giltig'
export const INVALID_STATE_REPLACED_MESSAGE = 'Intyget har blivit ersatt av ett senare intyg.'

const InvalidStateReplaced = ({ errorData }: ModalProps) => {
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
