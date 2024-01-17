import FocusTrap from 'focus-trap-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { clearError } from '../../../store/error/errorActions'
import { ErrorData } from '../../../store/error/errorReducer'
import { CustomButton } from '../../Inputs/CustomButton'
import ErrorCopyText from '../ErrorCopyText'

const Modal = styled.div`
  z-index: 9999;
`

const ButtonGroup = styled.div`
  margin-top: 1.875rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

interface ErrorModalProps {
  onConfirm?: () => void
  confirmButtonText?: string
  closeButtonText?: string
  errorData: ErrorData
}

const ErrorModalBase: React.FC<ErrorModalProps> = ({ onConfirm, confirmButtonText, closeButtonText = 'Stäng', children, errorData }) => {
  const [open, setOpen] = useState(true)
  const dispatch = useDispatch()

  const handleConfirm = () => {
    setOpen(false)
    onConfirm?.()
  }

  const handleClose = () => {
    dispatch(clearError({ errorId: errorData.errorId }))
    setOpen(false)
  }

  return (
    <FocusTrap
      active={open}
      focusTrapOptions={{
        tabbableOptions: {
          displayCheck: 'none',
        },
      }}
    >
      <div>
        <div className="ic-backdrop" onClick={handleClose} />
        <Modal role="alertdialog" className="ic-modal ic-modal--error" aria-labelledby="demo-modal-content">
          <div className="ic-modal__body">{children}</div>
          <ButtonGroup className={confirmButtonText ? 'ic-button-group ic-button-group--center' : ''}>
            <CustomButton onClick={handleClose} text={closeButtonText} />
            {confirmButtonText && <CustomButton onClick={handleConfirm} text={confirmButtonText} buttonStyle={'primary'} />}
          </ButtonGroup>
          <ErrorCopyText errorId={errorData.errorId} />
        </Modal>
      </div>
    </FocusTrap>
  )
}

export default ErrorModalBase
