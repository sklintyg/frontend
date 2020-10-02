import React from 'react'
import { trashImg } from '@frontend/common'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  img: {
    maxWidth: '130px',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

const RemovedCertificate = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <img className={classes.img} src={trashImg}></img>
      <Typography className={classes.title}>Utkastet är borttaget</Typography>
    </div>
  )
}

export default RemovedCertificate
