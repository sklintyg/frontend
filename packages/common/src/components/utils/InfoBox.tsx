import React from 'react'
import styled from 'styled-components'

interface Props {
  type: 'info' | 'error' | 'success' | 'observe'
  additionalStyles?: string
  squared?: boolean
  deactivateIconWrap?: boolean
}

const Icon = styled.i`
  margin-top: 3px;
`

const Wrapper = styled.div`
  width: 100%;
`

interface StyledWrapperProps {
  squared: boolean
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  border-radius: ${(props) => (props.squared ? '0' : '')};
`

const InfoBox: React.FC<Props> = ({ type, children, additionalStyles, squared, deactivateIconWrap }) => {
  const getIconClass = () => {
    switch (type) {
      case 'info':
        return 'ic-info-icon'
      case 'error':
        return 'ic-error-icon'
      case 'success':
        return 'ic-success-icon'
      case 'observe':
        return 'ic-observe-icon'
    }
  }

  const getWrapperClass = () => {
    switch (type) {
      case 'info':
        return 'ic-alert--info'
      case 'error':
        return 'ic-alert--error'
      case 'success':
        return 'ic-alert--success'
      case 'observe':
        return 'ic-alert--observe'
    }
  }

  return (
    // @ts-expect-error squared is giving error but it's working as intended
    <StyledWrapper squared={squared} className={`ic-alert ic-alert--status ${getWrapperClass()} ${additionalStyles}`}>
      <Wrapper className={`${deactivateIconWrap ? 'iu-flex' : ''}`}>
        <Icon className={`${deactivateIconWrap ? '' : 'iu-fl'} ic-alert__icon ${getIconClass()}`}></Icon>
        <div className={`${deactivateIconWrap ? '' : 'iu-ml-300'}`}>{children}</div>
      </Wrapper>
    </StyledWrapper>
  )
}

export default InfoBox
