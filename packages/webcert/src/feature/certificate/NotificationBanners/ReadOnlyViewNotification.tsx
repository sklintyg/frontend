import * as React from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { getUser } from '../../../store/user/userSelectors'
import _ from 'lodash'
import NotificationBannerBase from './NotificationBannerBase'

const ReadOnlyViewNotification: React.FC = () => {
  const metadata = useSelector(getCertificateMetaData, _.isEqual)
  const user = useSelector(getUser)

  const shouldRender = (): boolean => {
    const isSameCareProvider = metadata?.careProvider.unitId === user?.loggedInCareProvider.unitId
    const isDifferentCareUnit = metadata?.careUnit.unitId !== user?.loggedInCareUnit.unitId
    return isSameCareProvider && isDifferentCareUnit
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
