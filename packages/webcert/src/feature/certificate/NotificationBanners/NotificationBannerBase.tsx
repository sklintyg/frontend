import { InfoBox } from '@frontend/common'
import * as React from 'react'

interface Props {
  type: 'info' | 'error' | 'success' | 'observe'
  isGlobal?: boolean
}

const NotificationBannerBase: React.FC<Props> = ({ isGlobal, type, children }) => {
  return (
    <InfoBox squared type={type} additionalWrapperStyles={'ic-container'} isGlobal={isGlobal}>
      {children}
    </InfoBox>
  )
}

export default NotificationBannerBase
