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
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1.5),
    fontSize: theme.typography.pxToRem(12),
    borderRadius: 0,
    fontWeight: theme.typography.fontWeightRegular,
  },
  tooltipArrow: {
    color: theme.palette.primary.main,
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
  additionalConfirmButtonStyles?: React.CSSProperties
  confirmButtonDisabled?: boolean
  declineButtonText?: string
  additionalButtonStyles?: React.CSSProperties | undefined
  description: string
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
    <ButtonTooltip description={props.description}>
      <Button
        disabled={props.disabled}
        style={{ ...props.additionalButtonStyles }}
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
              style={{ ...props.additionalConfirmButtonStyles }}
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
