import { makeStyles, Paper } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  questionWrapper: {
    paddingTop: `${theme.spacing(2)}px`,
    paddingBottom: `${theme.spacing(2)}px`,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
}))

interface Props {
  additionalStyles?: string
}

const QuestionWrapper: React.FC<Props> = (props) => {
  const classes = useStyles()

  return <Paper className={`${classes.questionWrapper} contentPaperWrapper ${props.additionalStyles}`}>{props.children}</Paper>
}

export default QuestionWrapper
