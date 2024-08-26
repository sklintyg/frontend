import type React from 'react'
import ErrorModalBase from './ErrorModalBase'
import type { ModalProps } from './errorUtils'

export const INDETERMINATE_IDENTITY_TITLE = 'Intyget kunde inte signeras'
export const INDETERMINATE_IDENTITY_MESSAGE =
  'Det verkar som att du valt en annan identitet att signera med än den du loggade in med. ' +
  'Du måste identifiera dig på samma sätt som när du loggade in. Kontrollera om du har valt rätt och prova igen.'

const IndeterminateIdentity: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{INDETERMINATE_IDENTITY_TITLE}</strong>
      </p>
      <p>{INDETERMINATE_IDENTITY_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default IndeterminateIdentity
