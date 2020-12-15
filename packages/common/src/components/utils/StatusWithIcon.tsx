import React from 'react'
import CheckIcon from '@material-ui/icons/Check'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import styled from 'styled-components'
import colors from './../../styles/colors'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
interface Props {
  icon?: 'CheckIcon' | 'ErrorOutlineIcon'
  additionalWrapperStyles?: string
  additionalTextStyles?: string
}

const StatusWithIcon: React.FC<Props> = ({ icon, children, additionalTextStyles, additionalWrapperStyles }) => {
  const getIcon = (icon: Props['icon']) => {
    switch (icon) {
      case 'CheckIcon':
        return <CheckIcon className={`iu-color-success`} fontSize="small" />
      case 'ErrorOutlineIcon':
        return <ErrorOutlineIcon color="error" fontSize="small" />
      case undefined:
        return null
    }
  }

  return (
    <>
      <Wrapper className={`status ${additionalWrapperStyles}`}>
        {icon && getIcon(icon)}
        <p className={`iu-ml-200 iu-fs-100 iu-color-secondary-dark`}>{children}</p>
      </Wrapper>
    </>
  )
}

export default StatusWithIcon
