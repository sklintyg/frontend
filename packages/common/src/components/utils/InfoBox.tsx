import React from 'react'
import styled from 'styled-components'

interface Props {
  type: 'info' | 'error' | 'success'
  additionalStyles?: string
}

const StyledWrapper = styled.div`
  padding: 4px 8px;
  flex-wrap: nowrap;

  p {
    font-size: 14px;
    margin-left: 8px;
  }
`

const InfoBox: React.FC<Props> = ({ type, children, additionalStyles }) => {
  const getIconClass = () => {
    switch (type) {
      case 'info':
        return 'ic-info-icon'
      case 'error':
        return 'ic-error-icon'
      case 'success':
        return 'ic-success-icon'
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
    }
  }

  return (
    <StyledWrapper className={`ic-alert ic-alert--status ${getWrapperClass()} ${additionalStyles}`}>
      <i className={`ic-alert__icon ${getIconClass()}`}></i>
      <p>{children}</p>
    </StyledWrapper>
  )
}

export default InfoBox
