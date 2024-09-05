import React, { useCallback, useEffect } from 'react'
import type { FlattenSimpleInterpolation } from 'styled-components'
import { useKeyPress } from '../../../utils/userFunctionUtils'
import Checkbox from '../../Inputs/Checkbox'
import { CustomButton } from '../../Inputs/CustomButton'
import ModalBase from './ModalBase'

interface Props {
  disabled: boolean
  name: string
  modalTitle: string
  onConfirm: (isSelected: boolean) => void
  confirmButtonText: string
  additionalConfirmButtonStyles?: string
  confirmButtonDisabled?: boolean
  declineButtonText?: string
  additionalButtonStyles?: string
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  confirmButtonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  onClick?: () => void
  onClose?: () => void
  checked: boolean
  id: string
  wrapperStyles?: FlattenSimpleInterpolation
}

const CheckboxWithConfirmModal: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<boolean>(false)
  const escPress = useKeyPress('Escape')

  const handleClickOpen: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelected(event.currentTarget.checked)
    setOpen(true)

    props.onClick?.()
  }

  const handleClose = useCallback(() => {
    setOpen(false)

    props.onClose?.()
  }, [setOpen, props])

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm(selected)
  }

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress, handleClose])

  return (
    <div css={props.wrapperStyles}>
      <Checkbox
        id={props.id}
        label={props.name}
        value="checked"
        checked={props.checked}
        vertical={true}
        disabled={props.disabled}
        onChange={handleClickOpen}
      />
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={props.modalTitle}
        content={props.children}
        buttons={
          <>
            <CustomButton onClick={handleClose} buttonStyle="default" text={props.declineButtonText ? props.declineButtonText : 'Avbryt'} />
            <CustomButton
              buttonStyle={props.confirmButtonStyle ? props.confirmButtonStyle : 'primary'}
              className={props.additionalConfirmButtonStyles}
              disabled={props.confirmButtonDisabled}
              onClick={handleConfirm}
              text={props.confirmButtonText}
            />
          </>
        }
      />
    </div>
  )
}

export default CheckboxWithConfirmModal
