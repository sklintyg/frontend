import { makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const useStyles = makeStyles((theme) => ({
  questionWrapper: {
    paddingTop: `${theme.spacing(2)}px`,
    paddingBottom: `${theme.spacing(2)}px`,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
}))

const Wrapper = styled.section`
  padding-top: 16px;
  padding-bottom: 16px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

interface Props {
  additionalStyles?: string
}

const QuestionWrapper: React.FC<Props> = (props) => {
  const classes = useStyles()

  return <Wrapper className={`contentPaperWrapper box-shadow iu-bg-white`}>{props.children}</Wrapper>
}

export default QuestionWrapper
