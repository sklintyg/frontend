import type React from 'react'
import styled from 'styled-components'
import protectedPersonIcon from '../../images/lock-closed.svg'
import deceasedIcon from '../../images/warning.svg'
import { getFilter } from '../../utils/getFilters'

interface StyledIcon {
  activateIconWrap: boolean
}

const Img = styled.img<{ filter: string }>`
  filter: ${(props) => props.filter};
`

const Icon = styled.i<StyledIcon>`
  margin-top: ${(props) => (props.activateIconWrap ? '3px' : '2px')};
`

const Wrapper = styled.div`
  width: 100%;
`

interface StyledWrapperProps {
  squared?: boolean
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  border-radius: ${(props) => (props.squared ? '0' : '')};
`

interface Props {
  type: 'info' | 'error' | 'success' | 'observe' | 'protected_person' | 'deceased'
  additionalStyles?: string
  additionalWrapperStyles?: string
  squared?: boolean
  activateIconWrap?: boolean
}

const InfoBox: React.FC<Props> = ({ type, children, additionalStyles, squared, additionalWrapperStyles, activateIconWrap }) => {
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

  const getIcon = () => {
    if (type === 'protected_person') {
      return protectedPersonIcon
    } else if (type === 'deceased') {
      return deceasedIcon
    }
    return undefined
  }

  const getWrapperClass = () => {
    switch (type) {
      case 'info':
      case 'deceased':
      case 'protected_person':
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
    <StyledWrapper squared={squared} className={`ic-alert ic-alert--status iu-fs-200 iu-lh-body ${getWrapperClass()} ${additionalStyles}`}>
      <Wrapper className={`${!activateIconWrap ? 'iu-flex' : ''} ${additionalWrapperStyles}`}>
        {getIcon() ? (
          <Img src={getIcon()} className="ic-alert__icon" filter={getFilter('grey-500')} />
        ) : (
          <Icon activateIconWrap={!!activateIconWrap} className={`${!activateIconWrap ? '' : 'iu-fl'} ic-alert__icon ${getIconClass()}`} />
        )}
        {activateIconWrap ? <div className={'iu-ml-300'}>{children}</div> : <div>{children}</div>}
      </Wrapper>
    </StyledWrapper>
  )
}

export default InfoBox
