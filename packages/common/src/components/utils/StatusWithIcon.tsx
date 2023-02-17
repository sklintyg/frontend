import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styled from 'styled-components'
import CheckIcon from '../../images/CheckIcon'
import ErrorCircle from '../../images/ErrorCircle'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: #00706e;

  .statusContent > a,
  .statusContent > button {
    font-size: 12px;
  }
`

interface Props {
  icon?: 'CheckIcon' | 'ErrorOutlineIcon' | 'ArrowLeft'
  additionalWrapperStyles?: string
  additionalTextStyles?: string
  isModal?: boolean
}

const StatusWithIcon: React.FC<Props> = ({ isModal, icon, children, additionalWrapperStyles, additionalTextStyles }) => {
  const getIcon = (icon: Props['icon']) => {
    switch (icon) {
      case 'CheckIcon':
        return <CheckIcon />
      case 'ErrorOutlineIcon':
        return <ErrorCircle />
      case 'ArrowLeft':
        return <FontAwesomeIcon icon={faArrowLeft} />
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
