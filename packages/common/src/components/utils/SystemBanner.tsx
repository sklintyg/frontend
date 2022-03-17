import React from 'react'
import { Banner } from '../../types/utils'
import styled from 'styled-components'
import { sanitizeText } from '@frontend/common'
import externalLinkIcon from '../../images/external_link.svg'

interface Props {
  banner: Banner
}

const Icon = styled.i`
  margin-top: auto;
  margin-bottom: auto;
`

const SystemBanner: React.FC<Props> = ({ banner }) => {
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

  const addExternalIcon = (content: string) => {
    let bannerContent = content
    bannerContent = bannerContent.replace(
      new RegExp('</a>', 'g'),
      `<img src=${externalLinkIcon} alt="Länken öppnas i ny flik" style="display: inline; position: relative; top: 3px; left: 2px" /></a>`
    )
    bannerContent = bannerContent.replace(new RegExp('<a', 'g'), '<a target="_blank"')
    return sanitizeText(bannerContent)
  }

  return (
    <div className={`ic-alert-global iu-py-200 iu-fs-200 iu-lh-body ${getWrapperClass()}`}>
      <div className={'ic-global-alert__inner iu-flex iu-m-none'}>
        <Icon className={`ic-alert__icon ic-global-alert__icon ${getIconClass()}`} />
        <div dangerouslySetInnerHTML={addExternalIcon(banner.message)} />
      </div>
    </div>
  )
}

export default SystemBanner
