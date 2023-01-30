import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components/macro'

interface WrapperProps {
  highlighted: boolean
}

const Wrapper = styled.section<WrapperProps>`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${(props) => (props.highlighted ? '#FFF8E0' : '')} !important;
  &:not(:last-child) {
    padding-bottom: 1rem;
  }
`

interface Props {
  additionalStyles?: FlattenSimpleInterpolation
  highlighted?: boolean
}

const QuestionWrapper: React.FC<Props> = ({ additionalStyles, highlighted, children }) => {
  return (
    <Wrapper highlighted={Boolean(highlighted)} css={additionalStyles} className={`contentPaperWrapper questionWrapper iu-bg-white`}>
      {children}
    </Wrapper>
  )
}

export default QuestionWrapper
