import React from 'react'
import { ModalBase } from '../..'

interface Props {
  open: boolean
  modalTitle: string
}

const PopUpModal: React.FC<Props> = ({ open, modalTitle, children }) => {
  if (!open) {
    return null
  }

  const handleClose = () => {}

  return <ModalBase open={open} handleClose={handleClose} title={modalTitle} content={children} buttons={undefined} />
}

export default PopUpModal
