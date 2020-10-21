import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import CheckIcon from '@material-ui/icons/Check'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  checkIcon: {
    color: theme.palette.success.dark,
  },
  text: {
    marginLeft: theme.spacing(0.25),
    color: theme.palette.info.dark,
    fontSize: '12px',
  },
}))

interface Props {
  icon?: 'CheckIcon' | 'ErrorOutlineIcon'
  additionalWrapperStyles?: string
  additionalTextStyles?: string
}

const StatusWithIcon: React.FC<Props> = ({ icon, children, additionalTextStyles, additionalWrapperStyles }) => {
  const classes = useStyles()

  const getIcon = (icon: Props['icon']) => {
    switch (icon) {
      case 'CheckIcon':
        return <CheckIcon className={classes.checkIcon} fontSize="small" />
      case 'ErrorOutlineIcon':
        return <ErrorOutlineIcon color="error" fontSize="small" />
      case undefined:
        return null
    }
  }

  return (
    <>
      <Box className={`${classes.root} status ${additionalWrapperStyles}`}>
        {icon && getIcon(icon)}
        <Typography className={`${classes.text} ${additionalTextStyles}`}>{children}</Typography>
      </Box>
    </>
  )
}

export default StatusWithIcon
