import * as React from 'react'
import { useSelector } from 'react-redux'
import NotificationBannerBase from './NotificationBannerBase'
import { getBanners } from '../../../store/utils/utilsSelectors'
import { Banner } from '../../../store/utils/utilsReducer'

const SystemBanners: React.FC = () => {
  const banners: Banner[] = useSelector(getBanners)

  if (banners.length === 0) return null

  const renderBanners = () => {
    return banners.map((banner, index) => {
      return (
        <NotificationBannerBase key={'system-banner-' + index} type={banner.priority === 'HOG' ? 'info' : 'observe'} isGlobal>
          <p>{banner.message}</p>
        </NotificationBannerBase>
      )
    })
  }

  return <>{renderBanners()}</>
}

export default SystemBanners
