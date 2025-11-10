import { getCertificateResourceLink } from '../../../store/certificate/certificateSelectors'
import NotificationBannerBase from './NotificationBannerBase'
import { useAppSelector } from '../../../store/store'
import { ResourceLinkType } from '../../../types'

const InactiveCertificateNotification = () => {
  const inactiveCertificate = useAppSelector(getCertificateResourceLink(ResourceLinkType.INACTIVE_CERTIFICATE))

  if (!inactiveCertificate) return null

  return (
    <NotificationBannerBase type={'info'}>
      <p>Denna version av intyget är inte längre aktiv. Funktionaliteten för detta intyg kan därför vara begränsad.</p>
    </NotificationBannerBase>
  )
}

export default InactiveCertificateNotification
