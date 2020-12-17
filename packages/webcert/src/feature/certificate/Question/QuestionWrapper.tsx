import React from 'react'
import styled from 'styled-components'

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
  return <Wrapper className={`contentPaperWrapper box-shadow iu-bg-white`}>{props.children}</Wrapper>
}

export default QuestionWrapper
