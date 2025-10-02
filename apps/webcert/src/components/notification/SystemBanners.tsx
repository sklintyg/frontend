import { useAppSelector } from '../../store/store'
import { getBanners } from '../../store/utils/utilsSelectors'
import type { Banner } from '../../types'
import SystemBanner from '../utils/SystemBanner'

const SystemBanners = () => {
  const banners: Banner[] = useAppSelector(getBanners)

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
