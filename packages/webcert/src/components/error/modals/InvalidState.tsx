import { ModalProps } from './ModalUtils'
import React from 'react'
import ReloadModal from './ReloadModal'

const INVALID_STATE_TITLE = 'Funktionen är inte giltig.'
const INVALID_STATE_MESSAGE =
  'Förmodligen har en annan användare ändrat informationen medan du arbetat på samma post. Ladda om informationen och försök igen.'
const INVALID_STATE_MESSAGE_2 = 'Tekniskt fel. Utkastet kunde inte sparas. Om problemet kvarstår, kontakta din lokala IT-administratör.'

const InvalidState: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ReloadModal errorData={errorData}>
      <p>
        <strong>{INVALID_STATE_TITLE}</strong>
      </p>
      <p>{INVALID_STATE_MESSAGE}</p>
    </ReloadModal>
  )
}

export default InvalidState
