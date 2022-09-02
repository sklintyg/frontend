import React from 'react'
import { ModalProps } from './errorUtils'
import ReloadModal from './ReloadModal'

export const CONCURRENT_MODIFICATION_ERROR_TITLE = 'Utkastet har ändrats av en annan användare'
export const CONCURRENT_MODIFICATION_ERROR_MESSAGE = 'Öppna intyget på nytt och försök igen. Utkastet ändrades av: '

const ConcurrentModification: React.FC<ModalProps> = ({ errorData }) => {
  const NAME = errorData.message?.substring(0, errorData.message.indexOf(' -'))

  return (
    <ReloadModal errorData={errorData}>
      <p>
        <strong>{CONCURRENT_MODIFICATION_ERROR_TITLE}</strong>
      </p>
      <p>
        {CONCURRENT_MODIFICATION_ERROR_MESSAGE}
        {NAME}
      </p>
    </ReloadModal>
  )
}

export default ConcurrentModification
