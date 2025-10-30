import { getIsInactiveCertificateType } from '../../../store/certificate/certificateSelectors'
import NotificationBannerBase from './NotificationBannerBase'
import { useAppSelector } from '../../../store/store'

const InactiveCertificateTypeNotification = () => {
  const isInactiveCertificateType = useAppSelector(getIsInactiveCertificateType)

  if (!isInactiveCertificateType) return null

  return (
    <NotificationBannerBase type={'info'}>
      <p>Intyget är av en äldre version. Funktionaliteten för detta intyg kan vara begränsad.</p>
    </NotificationBannerBase>
  )
}

export default InactiveCertificateTypeNotification
