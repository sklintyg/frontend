import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  margin-top: 16px;
  border-bottom: 2px solid #e0e0e0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

interface Props {
  additionalStyles?: string
}

const CategoryHeader: React.FC<Props> = ({ additionalStyles, children }) => {
  return <Wrapper className={`contentPaperWrapper iu-bg-white iu-radius-sm box-shadow ${additionalStyles}`}>{children}</Wrapper>
}

export default CategoryHeader
