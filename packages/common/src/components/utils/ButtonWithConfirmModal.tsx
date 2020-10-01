import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, makeStyles } from '@material-ui/core'
import React from 'react'
import CloseIcon from '@material-ui/icons/Close'

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
      marginTop: theme.spacing(2)
    }
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
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paperWidthSm: classes.dialog, scrollPaper: classes.container }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <div className={classes.titleWrapper}>
          <DialogTitle style={{ padding: 0 }} id="alert-dialog-title">
            {props.modalTitle}
          </DialogTitle>
          <IconButton classes={{ root: classes.closeButton }} aria-label="close" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <Divider></Divider>
        <DialogContent id="alert-dialog-description" className={classes.content}>
          {props.children}
        </DialogContent>
        <DialogActions className={classes.buttonWrapper}>
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
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ButtonWithConfirmModal
