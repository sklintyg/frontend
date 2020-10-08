import { Button, DialogActions, DialogContent, makeStyles } from '@material-ui/core'
import React from 'react'
import ModalBase from './ModalBase'

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  dialog: {
    width: '600px',
    maxWidth: 'none',
    marginTop: '30px',
  },
  container: {
    alignItems: 'start',
  },
  content: {
    minHeight: '134px',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  closeButton: {
    padding: 0,
  },
}))

interface Props {
  buttonText: string
  buttonColor?: 'inherit' | 'default' | 'primary' | 'secondary'
  buttonVariant?: 'text' | 'outlined' | 'contained' | undefined
  startIcon?: React.ReactNode
  modalTitle: string
  onConfirm: () => any
  confirmButtonText: string
  confirmButtonColor?: 'inherit' | 'default' | 'primary' | 'secondary'
  confirmButtonDisabled?: boolean
  declineButtonText?: string
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
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
      <Button
        color={props.buttonColor ? props.buttonColor : 'default'}
        variant={props.buttonVariant ? props.buttonVariant : 'contained'}
        onClick={handleClickOpen}
        startIcon={props.startIcon ? props.startIcon : null}>
        {props.buttonText}
      </Button>
      <ModalBase
        open={open}
        handleClose={handleClose}
        modalTitle={props.modalTitle}
        content={props.children}
        modalButtons={
          <>
            <Button
              disabled={props.confirmButtonDisabled}
              variant="contained"
              color={props.confirmButtonColor ? props.confirmButtonColor : 'primary'}
              onClick={handleConfirm}>
              {props.confirmButtonText}
            </Button>
            <Button onClick={handleClose} variant="contained" color="default">
              {props.declineButtonText ? props.declineButtonText : 'Avbryt'}
            </Button>
          </>
        }></ModalBase>
    </>
  )
}

export default ButtonWithConfirmModal
