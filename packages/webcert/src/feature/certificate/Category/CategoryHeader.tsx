import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components/macro'

const Wrapper = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  margin-top: 16px;
  border-bottom: 2px solid #e0e0e0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

interface Props {
  additionalStyles?: FlattenSimpleInterpolation
}

const CategoryHeader: React.FC<Props> = ({ additionalStyles, children }) => {
  return (
    <Wrapper css={additionalStyles} className={`contentPaperWrapper iu-bg-white iu-radius-sm box-shadow`}>
      {children}
    </Wrapper>
  )
}

export default CategoryHeader
