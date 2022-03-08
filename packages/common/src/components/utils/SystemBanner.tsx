import React from 'react'
import { Banner } from '../../types/utils'
import styled from 'styled-components'

interface Props {
  banner: Banner
}

const Icon = styled.i`
  margin-top: auto;
  margin-bottom: auto;
`

const SystemBanner: React.FC<Props> = ({ banner, children }) => {
  const getIconClass = () => {
    if (banner.priority === 'HOG') {
      return 'ic-error-icon'
    } else if (banner.priority === 'MEDEL') {
      return 'ic-info-icon'
    }
    return 'ic-observe-icon'
  }

  const getWrapperClass = () => {
    if (banner.priority === 'HOG') {
      return 'ic-alert--error'
    } else if (banner.priority === 'MEDEL') {
      return 'ic-alert--info'
    }
    return 'ic-alert--observe'
  }

  return (
    <div className={`ic-alert-global iu-py-200 iu-fs-200 iu-lh-body ${getWrapperClass()}`}>
      <div className={'ic-global-alert__inner iu-flex iu-m-none'}>
        <Icon className={`ic-alert__icon ic-global-alert__icon ${getIconClass()}`} />
        {children}
      </div>
    </div>
  )
}

export default SystemBanner
