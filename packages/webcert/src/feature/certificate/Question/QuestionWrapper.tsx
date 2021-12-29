import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components/macro'

interface WrapperProps {
  highlighted: boolean
}

const Wrapper = styled.section<WrapperProps>`
  padding-top: 16px;
  padding-bottom: 16px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${(props) => (props.highlighted ? '#FFF8E0' : '')} !important;
`

interface Props {
  additionalStyles?: FlattenSimpleInterpolation
  highlighted?: boolean
}

const QuestionWrapper: React.FC<Props> = ({ additionalStyles, highlighted, children }) => {
  return (
    // @ts-expect-error highlighted gives error but works as expected
    <Wrapper highlighted={highlighted} css={additionalStyles} className={`contentPaperWrapper questionWrapper iu-bg-white`}>
      {children}
    </Wrapper>
  )
}

export default QuestionWrapper
