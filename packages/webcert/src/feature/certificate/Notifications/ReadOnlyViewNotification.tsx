import * as React from 'react'
import { useSelector } from 'react-redux'
import { InfoBox } from '@frontend/common'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { getUser } from '../../../store/user/userSelectors'
import _ from 'lodash'

const ReadOnlyViewNotification: React.FC = () => {
  const metadata = useSelector(getCertificateMetaData, _.isEqual)
  const user = useSelector(getUser)

  const shouldRender = (): boolean => {
    const isSameCareProvider = metadata?.careProvider.unitId === user?.loggedInCareProvider.unitId
    const isDifferentUnit = metadata?.unit.unitId !== user?.loggedInUnit.unitId
    return isSameCareProvider && isDifferentUnit
  }

  if (!shouldRender()) return null

  return (
    <InfoBox squared type={'observe'}>
      <p>
        Utfärdat på: {metadata?.careProvider.unitName} - {metadata?.unit.unitName}
      </p>
    </InfoBox>
  )
}

export default ReadOnlyViewNotification
