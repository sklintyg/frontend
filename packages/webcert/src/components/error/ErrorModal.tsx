import React, { useState } from 'react'
import { CustomButton } from '@frontend/common'
import FocusTrap from 'focus-trap-react'
import { clearError } from '../../store/error/errorActions'
import { useDispatch } from 'react-redux'
import { ErrorData } from '../../store/error/errorReducer'

interface ErrorModalProps {
  onConfirm?: () => void
  confirmButtonText: string
  closeButtonText?: string
  content: string
  errorData: ErrorData
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onConfirm, confirmButtonText, closeButtonText = 'Stäng', content, errorData }) => {
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
        <CustomButton onClick={handleConfirm} text={confirmButtonText} />
        <CustomButton onClick={handleClose} text={closeButtonText} />
      </>
    )
  }

  return (
    <FocusTrap active={open}>
      <div role="alertdialog" className="ic-modal ic-modal--error" aria-labelledby="demo-modal-content">
        <div className="ic-modal__body">
          <p>{content}</p>
        </div>
        <div className="ic-button-group ic-button-group--center">{getButtons()}</div>
      </div>
    </FocusTrap>
  )
}

export default ErrorModal
