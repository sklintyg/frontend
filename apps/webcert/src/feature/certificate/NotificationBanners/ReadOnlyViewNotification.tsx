import { isEqual } from 'lodash-es'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { getUser } from '../../../store/user/userSelectors'
import NotificationBannerBase from './NotificationBannerBase'

const ReadOnlyViewNotification = () => {
  const metadata = useSelector(getCertificateMetaData, isEqual)
  const user = useSelector(getUser)

  const shouldRender = (): boolean => {
    if (!metadata || !user) {
      return false
    }
    return metadata.careUnit.unitId !== user.loggedInCareUnit.unitId
  }

  if (!shouldRender()) return null

  return (
    <NotificationBannerBase type={'observe'}>
      <p>
        Utfärdat på: {metadata?.careProvider.unitName} - {metadata?.careUnit.unitName}
      </p>
    </NotificationBannerBase>
  )
}

export default ReadOnlyViewNotification
