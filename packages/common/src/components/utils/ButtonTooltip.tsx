import { makeStyles, Tooltip } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1.5),
    fontSize: theme.typography.pxToRem(12),
    borderRadius: 0,
    fontWeight: theme.typography.fontWeightRegular,
    '-webkit-box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.75)',
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
  },
  tooltipArrow: {
    color: theme.palette.primary.main,
  },
}))

interface Props {
  description: string
  children: React.ReactElement<any, any>
}

const ButtonTooltip: React.FC<Props> = ({ children, description }) => {
  const classes = useStyles()

  return (
    <Tooltip classes={{ tooltip: classes.tooltip, arrow: classes.tooltipArrow }} placement="top" enterDelay={300} title={description} arrow>
      {children}
    </Tooltip>
  )
}

export default ButtonTooltip
