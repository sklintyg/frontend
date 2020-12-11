import { makeStyles } from '@material-ui/core'
import React from 'react'
import { Spinner } from '..'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: theme.zIndex.modal,
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  open: boolean
  spinnerText: string
}

const Backdrop: React.FC<Props> = ({ open, spinnerText, children }) => {
  const classes = useStyles()

  if (!open) return <>{children}</>

  return (
    <div className={classes.backdrop}>
      <div className={classes.content}>
        <Spinner text={spinnerText} />
      </div>
    </div>
  )
}

export default Backdrop
