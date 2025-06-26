import type React from 'react'
import styled from 'styled-components'

const Icon = styled.span`
  font-size: 1.5rem;
  line-height: 1.5rem;
  position: absolute;
  margin-left: -16px;
  font-weight: 400 !important;
`

const Wrapper = styled.span`
  position: relative;
`

const MandatoryIcon = () => (
  <Wrapper>
    <Icon data-testid="mandatory-icon" className="iu-color-error">
      *
    </Icon>
  </Wrapper>
)

export default MandatoryIcon
