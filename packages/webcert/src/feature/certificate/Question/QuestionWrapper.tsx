import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components/macro'

const Wrapper = styled.section`
  padding-top: 16px;
  padding-bottom: 16px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`
interface Props {
  additionalStyles?: FlattenSimpleInterpolation
}

const QuestionWrapper: React.FC<Props> = ({ additionalStyles, children }) => {
  return (
    <Wrapper css={additionalStyles} className={`contentPaperWrapper questionWrapper box-shadow iu-bg-white`}>
      {children}
    </Wrapper>
  )
}

export default QuestionWrapper
