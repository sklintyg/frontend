import { Banner, SystemBanner } from '@frontend/common'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { getBanners } from '../../store/utils/utilsSelectors'

const SystemBanners: React.FC = () => {
  const banners: Banner[] = useSelector(getBanners)

  if (banners.length === 0) return null

  const renderBanners = () => {
    return banners.map((banner, index) => {
      return (
        <SystemBanner key={'system-banner-' + index} banner={banner}>
          <p>{banner.message}</p>
        </SystemBanner>
      )
    })
  }

  return <>{renderBanners()}</>
}

export default SystemBanners
