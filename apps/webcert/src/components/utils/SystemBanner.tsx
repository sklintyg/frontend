import type { ReactNode } from 'react'
import styled from 'styled-components'
import externalLinkIcon from '../../images/external_link.svg'
import type { Banner } from '../../types/utils'
import { sanitizeText } from '../../utils/sanitizeText'

interface Props {
  banner: Banner
  children?: ReactNode
}

const Icon = styled.i`
  margin-top: auto;
  margin-bottom: auto;
`

const Content = styled.div`
  img {
    display: inline;
    position: relative;
    top: 3px;
    left: 2px;
  }
`

const SystemBanner = ({ banner }: Props) => {
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

  const modifyBannerContent = (content: string) => {
    let bannerContent = content
    bannerContent = bannerContent.replace(/<\/a>/g, `<img src=${externalLinkIcon} alt="Länken öppnas i ny flik" /></a>`)
    bannerContent = bannerContent.replace(/<a/g, '<a target="_blank"')
    return sanitizeText(bannerContent)
  }

  return (
    <div className={`ic-alert-global iu-py-200 iu-fs-200 iu-lh-body ${getWrapperClass()}`}>
      <div className={'ic-global-alert__inner iu-flex iu-mt-none iu-mb-none'}>
        <Icon className={`ic-alert__icon ic-global-alert__icon ${getIconClass()}`} />
        <Content dangerouslySetInnerHTML={modifyBannerContent(banner.message)} />
      </div>
    </div>
  )
}

export default SystemBanner
