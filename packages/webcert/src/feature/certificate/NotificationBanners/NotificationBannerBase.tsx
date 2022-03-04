import { InfoBox } from '@frontend/common'
import * as React from 'react'

interface Props {
  type: 'info' | 'error' | 'success' | 'observe'
}

const NotificationBannerBase: React.FC<Props> = ({ type, children }) => {
  return (
    <InfoBox squared type={type} additionalWrapperStyles={'ic-container'}>
      {children}
    </InfoBox>
  )
}

export default NotificationBannerBase
