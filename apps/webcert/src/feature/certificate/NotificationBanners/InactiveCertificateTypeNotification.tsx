import { getCertificateResourceLink, getIsInactiveCertificateType } from '../../../store/certificate/certificateSelectors'
import NotificationBannerBase from './NotificationBannerBase'
import { useAppSelector } from '../../../store/store'
import { ResourceLinkType } from '../../../types'

const InactiveCertificateTypeNotification = () => {
  const isInactiveCertificateType = useAppSelector(getIsInactiveCertificateType)
  const inactiveCertificate = useAppSelector(getCertificateResourceLink(ResourceLinkType.INACTIVE_CERTIFICATE))

  if (!isInactiveCertificateType || inactiveCertificate) return null

  return (
    <NotificationBannerBase type={'info'}>
      <p>Intyget är av en äldre version. Funktionaliteten för detta intyg kan vara begränsad.</p>
    </NotificationBannerBase>
  )
}

export default InactiveCertificateTypeNotification
