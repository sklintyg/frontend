import React, { useEffect } from 'react'
import { CustomButton, ModalBase } from '../..'
import { useKeyPress } from '../../../utils/userFunctionUtils'

interface Props {
  text: string
  modalTitle: string
  additionalStyles?: string
  additionalContentStyles?: string
}

const TextWithInfoModal: React.FC<Props> = ({ text, modalTitle, additionalStyles, additionalContentStyles, children }) => {
  const [open, setOpen] = React.useState(false)
  const escPress = useKeyPress('Escape')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress])

  return (
    <>
      <a href="#" className={`ic-link ${additionalStyles && additionalStyles}`} onClick={handleClickOpen}>
        {text}
      </a>
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={modalTitle}
        content={children}
        buttons={<CustomButton onClick={handleClose} buttonStyle="default" text="Stäng" />}
      />
    </>
  )
}

export default TextWithInfoModal
