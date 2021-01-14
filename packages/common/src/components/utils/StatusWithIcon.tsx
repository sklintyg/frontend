import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
interface Props {
  icon?: 'CheckIcon' | 'ErrorOutlineIcon'
  additionalWrapperStyles?: string
  additionalTextStyles?: string
}

const StatusWithIcon: React.FC<Props> = ({ icon, children, additionalWrapperStyles }) => {
  const getIcon = (icon: Props['icon']) => {
    switch (icon) {
      case 'CheckIcon':
        return <FontAwesomeIcon icon={faCheck} className={`iu-color-success`} size="sm" />
      case 'ErrorOutlineIcon':
        return <FontAwesomeIcon icon={faExclamationCircle} color="error" size="sm" />
      case undefined:
        return null
    }
  }

  return (
    <>
      <Wrapper className={`status ${additionalWrapperStyles}`}>
        {icon && getIcon(icon)}
        <div className={`iu-ml-200 iu-fs-100 iu-color-secondary-dark`}>{children}</div>
      </Wrapper>
    </>
  )
}

export default StatusWithIcon
