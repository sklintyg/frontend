import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components/macro'

const Icon = styled.span`
  font-size: 1.5rem;
  position: absolute;
  margin-left: -16px;
`

const Wrapper = styled.span`
  position: relative;
`

interface Props {
  additionalStyles?: FlattenSimpleInterpolation
  display: boolean
}

const MandatoryIcon: React.FC<Props> = ({ additionalStyles, display }) => {
  if (!display) return null

  return (
    <Wrapper css={additionalStyles}>
      <Icon className="iu-color-error">*</Icon>
    </Wrapper>
  )
}

export default MandatoryIcon
