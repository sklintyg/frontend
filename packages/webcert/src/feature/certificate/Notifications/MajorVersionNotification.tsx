import * as React from 'react'
import { useSelector } from 'react-redux'
import { InfoBox } from '@frontend/common'
import { getIsLatestMajorVersion } from '../../../store/certificate/certificateSelectors'

const MajorVersionNotification: React.FC = () => {
  const isLatestMajorVersion = useSelector(getIsLatestMajorVersion)

  if (isLatestMajorVersion) return null

  return (
    <InfoBox squared type={'info'}>
      <p>Du kan inte använda alla funktioner, intyget är av en äldre version.</p>
    </InfoBox>
  )
}

export default MajorVersionNotification
