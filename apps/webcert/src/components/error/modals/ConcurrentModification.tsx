import type React from 'react'
import type { ModalProps } from './errorUtils'
import { messageSubstring } from './errorUtils'
import ReloadModal from './ReloadModal'

export const CONCURRENT_MODIFICATION_ERROR_TITLE = 'Utkastet har ändrats av en annan användare'
export const CONCURRENT_MODIFICATION_ERROR_MESSAGE = 'Prova att ladda om sidan och försök igen. Utkastet ändrades av:'

const ConcurrentModification: React.FC<ModalProps> = ({ errorData }) => {
  const NAME = messageSubstring(errorData)

  return (
    <ReloadModal errorData={errorData}>
      <p>
        <strong>{CONCURRENT_MODIFICATION_ERROR_TITLE}</strong>
      </p>
      <p>
        {CONCURRENT_MODIFICATION_ERROR_MESSAGE} {NAME}
      </p>
    </ReloadModal>
  )
}

export default ConcurrentModification
