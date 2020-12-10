import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}))

interface Props {
  titleId?: string
  additionalStyles?: string
}

const CategoryTitle: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <h3 id={props.titleId} className={`${classes.heading} ${props.additionalStyles} iu-fs-400 iu-color-black`}>
      {props.children}
    </h3>
  )
}

export default CategoryTitle
