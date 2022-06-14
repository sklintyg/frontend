import React, { useState } from 'react'
import { CustomButton } from '@frontend/common'
import FocusTrap from 'focus-trap-react'
import { clearError } from '../../../store/error/errorActions'
import { useDispatch } from 'react-redux'
import { ErrorData } from '../../../store/error/errorReducer'
import ErrorCopyText from '../ErrorCopyText'
import styled from 'styled-components'

const Modal = styled.div`
  z-index: 9999;
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

  const getButtons = () => {
    return (
      <>
        {confirmButtonText && <CustomButton onClick={handleConfirm} text={confirmButtonText} buttonStyle={'primary'} />}
        <CustomButton onClick={handleClose} text={closeButtonText} />
      </>
    )
  }

  return (
    <FocusTrap active={open}>
      <div>
        <div className="ic-backdrop" onClick={handleClose} />
        <Modal role="alertdialog" className="ic-modal ic-modal--error" aria-labelledby="demo-modal-content">
          <div className="ic-modal__body">{children}</div>
          <div className="ic-button-group ic-button-group--center">{getButtons()}</div>
          <ErrorCopyText errorId={errorData.errorId} />
        </Modal>
      </div>
    </FocusTrap>
  )
}

export default ErrorModalBase
