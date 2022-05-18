import React from 'react'
import styled from 'styled-components'
import AlertCircle from '../../images/AlertCircle'
import CheckIcon from '../../images/CheckIcon'

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
        return <CheckIcon />
      case 'ErrorOutlineIcon':
        return <AlertCircle />
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
