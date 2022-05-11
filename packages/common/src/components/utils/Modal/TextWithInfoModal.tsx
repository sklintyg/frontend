import React, { useEffect } from 'react'
import styled from 'styled-components'
import { CustomButton, ModalBase } from '../..'
import { useKeyPress } from '../../../utils/userFunctionUtils'
import classnames from 'classnames'

const AboutButton = styled.button`
  background: none;
  border: none;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
`

interface Props {
  text: string
  modalTitle: string
  className?: string
  additionalStyles?: string
}

const TextWithInfoModal: React.FC<Props> = ({ text, modalTitle, children, additionalStyles, className }) => {
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
      <AboutButton className={classnames('ic-link iu-color-cta-dark', className)} onClick={handleClickOpen}>
        {text}
      </AboutButton>
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
