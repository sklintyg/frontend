import React from 'react'
import WarningIcon from '@material-ui/icons/Warning'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    display: 'flex',
  },
  danger: {
    background: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  info: {
    background: theme.palette.info.light,
    color: theme.palette.info.dark,
  },
  infoText: {
    marginLeft: theme.spacing(1),
  },
  link: {
    color: theme.palette.warning.main,
    fontSize: theme.typography.body1.fontSize,
    textDecoration: 'underline',
    cursor: 'pointer',
    '& :first-letter': {
      textTransform: 'capitalize',
    },
  },
  linksWrapper: {
    marginTop: theme.spacing(1),
  },
}))

interface Props {
  type: 'info' | 'danger'
  additionalStyles?: string
}

const InfoBox: React.FC<Props> = ({ type, children, additionalStyles }) => {
  const classes = useStyles()

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <InfoOutlinedIcon />
      case 'danger':
        return <WarningIcon />
    }
  }

  return (
    <div className={`${classes.root} ${classes[type]} ${additionalStyles && additionalStyles}`}>
      {getIcon()}
      <Typography className={classes.infoText}>{children}</Typography>
    </div>
  )
}

export default InfoBox
