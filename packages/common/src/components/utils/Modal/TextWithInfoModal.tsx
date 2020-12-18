import React from 'react'
import { CustomButton, ModalBase } from '../..'
import { Link } from 'react-router-dom'

interface Props {
  text: string
  modalTitle: string
  additionalStyles?: string
  additionalContentStyles?: string
}

const TextWithInfoModal: React.FC<Props> = ({ text, modalTitle, additionalStyles, additionalContentStyles, children }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Link to="#" className={`ic-link ${additionalStyles && additionalStyles}`} onClick={handleClickOpen}>
        {text}
      </Link>
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={modalTitle}
        content={children}
        buttons={<CustomButton onClick={handleClose} style="default" text="Stäng" />}
      />
    </>
  )
}

export default TextWithInfoModal
