import { useSelector } from 'react-redux'
import { getIsLatestMajorVersion } from '../../../store/certificate/certificateSelectors'
import NotificationBannerBase from './NotificationBannerBase'

const MajorVersionNotification: React.FC = () => {
  const isLatestMajorVersion = useSelector(getIsLatestMajorVersion)

  if (isLatestMajorVersion) return null

  return (
    <NotificationBannerBase type={'observe'}>
      <p>Du kan inte använda alla funktioner, intyget är av en äldre version.</p>
    </NotificationBannerBase>
  )
}

export default MajorVersionNotification
