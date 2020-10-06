import { makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  mandatoryIcon: {
    color: theme.palette.error.main,
    fontSize: '1.5rem',
    position: 'absolute',
    marginLeft: -theme.spacing(2),
  },
  wrapper: {
    position: 'relative',
  },
}))

interface Props {
  additionalStyles?: string
  display: boolean
}

const MandatoryIcon: React.FC<Props> = ({ additionalStyles, display }) => {
  if (!display) return null

  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <span className={`${classes.mandatoryIcon} ${additionalStyles && additionalStyles}`}>*</span>
    </div>
  )
}

export default MandatoryIcon
