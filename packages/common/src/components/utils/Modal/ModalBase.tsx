import React from 'react'
import { makeStyles, Dialog, DialogTitle, IconButton, Divider, DialogActions, DialogContent } from '@material-ui/core'
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
    '& p': {
      fontSize: theme.typography.body2.fontSize,
    },
    '& a': {
      textDecoration: 'underline',
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
  open: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  modalTitle: string
  modalButtons: React.ReactNode
  content: React.ReactNode
  additionalContentStyles?: string
}

const ModalBase: React.FC<Props> = ({ open, handleClose, modalTitle, modalButtons, content, additionalContentStyles }) => {
  const classes = useStyles()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paperWidthSm: classes.dialog, scrollPaper: classes.container }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <div className={classes.titleWrapper}>
        <DialogTitle style={{ padding: 0 }} id="alert-dialog-title">
          {modalTitle}
        </DialogTitle>
        <IconButton classes={{ root: classes.closeButton }} aria-label="close" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <Divider></Divider>
      <DialogContent id="alert-dialog-description" className={`${classes.content} ${additionalContentStyles}`}>
        {content}
      </DialogContent>
      <DialogActions className={classes.buttonWrapper}>{modalButtons}</DialogActions>
    </Dialog>
  )
}

export default ModalBase
