import { Button, Link, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { ModalBase } from '../..'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'underline',
    color: 'inherit',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

interface Props {
  text: string
  modalTitle: string
  additionalStyles?: string
}

const TextWithInfoModal: React.FC<Props> = ({ text, modalTitle, additionalStyles, children }) => {
  const [open, setOpen] = React.useState(false)
  const classes = useStyles()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Link className={`${classes.link} ${additionalStyles && additionalStyles}`} onClick={handleClickOpen}>
        {text}
      </Link>
      <ModalBase
        open={open}
        handleClose={handleClose}
        modalTitle={modalTitle}
        content={children}
        modalButtons={
          <Button onClick={handleClose} variant="contained" color="default">
            Stäng
          </Button>
        }></ModalBase>
    </>
  )
}

export default TextWithInfoModal
