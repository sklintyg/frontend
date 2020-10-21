import { ButtonTooltip } from '@frontend/common'
import { Button, DialogActions, DialogContent, makeStyles } from '@material-ui/core'
import React, { ReactNode } from 'react'
import ModalBase from './ModalBase'

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
  description: string
  onClick?: () => void
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)

    if(props.onClick){
      props.onClick()
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm()
  }

  return (
    <>
      <ButtonTooltip description={props.description}>
        <Button
          disabled={props.disabled}
          className={props.additionalButtonStyles}
          color={props.buttonColor ? props.buttonColor : 'default'}
          variant={props.buttonVariant ? props.buttonVariant : 'contained'}
          onClick={handleClickOpen}
          startIcon={props.startIcon ? props.startIcon : null}>
          {props.name}
        </Button>
      </ButtonTooltip>
      <ModalBase
        additionalContentStyles={classes.content}
        open={open}
        handleClose={handleClose}
        modalTitle={props.modalTitle}
        content={props.children}
        modalButtons={
          <>
            <Button
              className={props.additionalConfirmButtonStyles}
              disableElevation
              disabled={props.confirmButtonDisabled}
              variant="contained"
              color={props.confirmButtonColor ? props.confirmButtonColor : 'default'}
              onClick={handleConfirm}>
              {props.confirmButtonText}
            </Button>
            <Button onClick={handleClose} variant="outlined" color="default">
              {props.declineButtonText ? props.declineButtonText : 'Avbryt'}
            </Button>
          </>
        }></ModalBase>
    </>
  )
}

export default ButtonWithConfirmModal
