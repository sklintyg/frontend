import classnames from 'classnames'
import React, { ReactNode, useEffect } from 'react'
import { LinkButton } from '../../../styles'
import { useKeyPress } from '../../../utils/userFunctionUtils'
import { CustomButton } from '../../Inputs'
import ModalBase from './ModalBase'

interface Props {
  text: string
  modalTitle: string
  className?: string
  children: ReactNode
}

const TextWithInfoModal: React.FC<Props> = ({ text, modalTitle, children, className }) => {
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
      <LinkButton className={classnames('ic-link iu-color-cta-dark', className)} onClick={handleClickOpen}>
        {text}
      </LinkButton>
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
