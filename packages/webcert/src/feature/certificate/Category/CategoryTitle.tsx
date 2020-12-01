import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.h6.fontSize,
  },
}))

interface Props {
  titleId?: string
  additionalStyles?: string
}

const CategoryTitle: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <Typography id={props.titleId} className={`${classes.heading} ${props.additionalStyles}`} variant="h3">
      {props.children}
    </Typography>
  )
}

export default CategoryTitle
