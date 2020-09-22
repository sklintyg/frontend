import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.h6.fontSize,
  },
}))

interface Props {
  id?: string
}

const CategoryTitle: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <Typography id={props.id} className={classes.heading} variant="h4">
      {props.children}
    </Typography>
  )
}

export default CategoryTitle
