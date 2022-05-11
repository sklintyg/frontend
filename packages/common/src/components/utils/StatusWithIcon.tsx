import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .statusContent > a,
  .statusContent > button {
    font-size: 12px;
  }
`

interface Props {
  icon?: 'CheckIcon' | 'ErrorOutlineIcon'
  additionalWrapperStyles?: string
  additionalTextStyles?: string
  isModal?: boolean
}

const StatusWithIcon: React.FC<Props> = ({ isModal, icon, children, additionalWrapperStyles, additionalTextStyles }) => {
  const getIcon = (icon: Props['icon']) => {
    switch (icon) {
      case 'CheckIcon':
        return <FontAwesomeIcon icon={faCheck} className={`iu-color-success`} size="1x" />
      case 'ErrorOutlineIcon':
        return <FontAwesomeIcon icon={faExclamationCircle} color="error" size="1x" />
      case undefined:
        return null
    }
  }

  return (
    <>
      <Wrapper className={`status ${additionalWrapperStyles}`}>
        {icon && getIcon(icon)}
        <div className={`iu-ml-200 statusContent ${isModal ? '' : 'iu-color-secondary-dark iu-fs-100'} ${additionalTextStyles}`}>
          {children}
        </div>
      </Wrapper>
    </>
  )
}

export default StatusWithIcon
