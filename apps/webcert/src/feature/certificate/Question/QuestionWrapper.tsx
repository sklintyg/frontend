import React from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'

interface WrapperProps {
  highlighted: boolean
}

const Wrapper = styled.section<WrapperProps>`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }
  ${({ highlighted }) =>
    highlighted &&
    css`
      background-color: #fff8e0 !important;
      padding: 0.9375rem 0;
    `}
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
