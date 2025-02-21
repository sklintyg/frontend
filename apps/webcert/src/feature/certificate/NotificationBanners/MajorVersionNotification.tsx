import { getIsInactiveCertificateType, getIsLatestMajorVersion } from '../../../store/certificate/certificateSelectors'
import NotificationBannerBase from './NotificationBannerBase'
import { useAppSelector } from '../../../store/store'

const MajorVersionNotification: React.FC = () => {
  const isLatestMajorVersion = useAppSelector(getIsLatestMajorVersion)
  const isInactiveCertificateType = useAppSelector(getIsInactiveCertificateType)

  if (isLatestMajorVersion || isInactiveCertificateType) return null

  return (
    <NotificationBannerBase type={'observe'}>
      <p>Du kan inte använda alla funktioner, intyget är av en äldre version.</p>
    </NotificationBannerBase>
  )
}

export default MajorVersionNotification
