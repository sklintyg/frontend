import React from 'react'
import { CustomButton } from '../..'
import { ModalBase } from '../..'

interface Props {
  open: boolean
  modalTitle: string
  handleClose: () => void
  showCloseButton: boolean
}

const PopUpModal: React.FC<Props> = ({ open, modalTitle, handleClose, showCloseButton, children }) => {
  if (!open) {
    return null
  }

  return (
    <ModalBase 
      open={open} 
      handleClose={handleClose} 
      title={modalTitle} 
      content={children} 
      buttons={showCloseButton && <CustomButton onClick={handleClose} buttonStyle="secondary" text='Avbryt' />} 
      enableCross={showCloseButton} />
  )
}

export default PopUpModal
