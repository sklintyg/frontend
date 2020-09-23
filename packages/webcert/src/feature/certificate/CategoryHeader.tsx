import { makeStyles, Paper, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: `${theme.spacing(2)}px`,
    paddingBottom: `${theme.spacing(2)}px`,
    marginTop: `${theme.spacing(2)}px`,
    borderBottom: `2px solid ${grey[300]}`,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
}))

interface Props {
  additionalStyles?: string
}

const CategoryHeader: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <Paper className={`${classes.root} contentPaperWrapper ${props.additionalStyles}`}>
      {props.children}
    </Paper>
  )
}

export default CategoryHeader
