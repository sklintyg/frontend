import type React from 'react'
import type { FlattenSimpleInterpolation } from 'styled-components'
import styled from 'styled-components'

const Wrapper = styled.div`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }
`

const InnerWrapper = styled.div`
  padding: 16px 0;
  border-bottom: 2px solid #e0e0e0;
`

interface Props {
  additionalStyles?: FlattenSimpleInterpolation
}

const CategoryHeader: React.FC<Props> = ({ additionalStyles, children }) => {
  return (
    <Wrapper className="iu-bg-white iu-radius-sm">
      <InnerWrapper css={additionalStyles} className="contentPaperWrapper">
        {children}
      </InnerWrapper>
    </Wrapper>
  )
}

export default CategoryHeader
