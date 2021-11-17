import React from 'react'
import styled from 'styled-components'

interface Props {
  type: 'info' | 'error' | 'success' | 'observe'
  additionalStyles?: string
  squared?: boolean
}

const Icon = styled.i`
  margin-top: 3px;
`

interface StyledWrapperProps {
  squared: boolean
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  border-radius: ${(props) => (props.squared ? '0' : '')};
`

const InfoBox: React.FC<Props> = ({ type, children, additionalStyles, squared }) => {
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
      <div>
        <Icon className={`iu-fl ic-alert__icon ${getIconClass()}`}></Icon>
        <div className={'iu-ml-300'}>{children}</div>
      </div>
    </StyledWrapper>
  )
}

export default InfoBox
