import { ButtonTooltip } from '@frontend/common'
import { Button, DialogActions, DialogContent, makeStyles } from '@material-ui/core'
import React, { ReactNode } from 'react'
import ModalBase from './ModalBase'
import CustomButton from '@frontend/webcert/src/feature/certificate/Buttons/CustomButton'

const useStyles = makeStyles((theme) => ({
  content: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

interface Props {
  disabled: boolean
  name: string
  buttonColor?: 'inherit' | 'default' | 'primary' | 'secondary'
  buttonVariant?: 'text' | 'outlined' | 'contained' | undefined
  startIcon?: React.ReactNode
  modalTitle: string
  onConfirm: () => any
  confirmButtonText: string
  confirmButtonColor?: 'inherit' | 'default' | 'primary' | 'secondary'
  additionalConfirmButtonStyles?: string
  confirmButtonDisabled?: boolean
  declineButtonText?: string
  additionalButtonStyles?: string
  buttonStyle?: 'primary' | 'secondary' | 'success'
  description: string
  onClick?: () => void
  onClose?: () => void
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)

    props.onClick?.()
  }

  const handleClose = () => {
    setOpen(false)

    props.onClose?.()
  }

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm()
  }

  return (
    <>
      <CustomButton
        tooltip={props.description}
        style={props.buttonStyle ? props.buttonStyle : 'primary'}
        disabled={props.disabled}
        className={props.additionalButtonStyles}
        color={props.buttonColor ? props.buttonColor : 'default'}
        variant={props.buttonVariant ? props.buttonVariant : 'contained'}
        onClick={handleClickOpen}
        startIcon={props.startIcon ? props.startIcon : null}
        text={props.name}
      />
      <ModalBase
        additionalContentStyles={classes.content}
        open={open}
        handleClose={handleClose}
        modalTitle={props.modalTitle}
        content={props.children}
        modalButtons={
          <>
            <CustomButton
              style="success"
              className={props.additionalConfirmButtonStyles}
              //disableElevation
              disabled={props.confirmButtonDisabled}
              variant="contained"
              color={props.confirmButtonColor ? props.confirmButtonColor : 'default'}
              onClick={handleConfirm}
              text={props.confirmButtonText}></CustomButton>
            <CustomButton
              onClick={handleClose}
              variant="outlined"
              style="default"
              text={props.declineButtonText ? props.declineButtonText : 'Avbryt'}></CustomButton>
          </>
        }></ModalBase>
    </>
  )
}

export default ButtonWithConfirmModal
