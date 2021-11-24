import React from 'react'
import { ModalProps } from './ModalUtils'
import ReloadModal from './ReloadModal'

export const CONCURRENT_MODIFICATION_ERROR_MESSAGE =
  'Utkastet har samtidigt ändrats av en annan användare och kunde därför inte sparas. Ladda om sidan och försök igen.'

const ConcurrentModification: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ReloadModal errorData={errorData}>
      <p>{CONCURRENT_MODIFICATION_ERROR_MESSAGE}</p>
    </ReloadModal>
  )
}

export default ConcurrentModification
