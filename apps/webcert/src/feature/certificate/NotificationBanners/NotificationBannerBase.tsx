import type { ReactNode } from 'react'
import InfoBox from '../../../components/utils/InfoBox'

interface Props {
  type: 'info' | 'error' | 'success' | 'observe'
  children: ReactNode
}

const NotificationBannerBase = ({ type, children }: Props) => {
  return (
    <InfoBox squared type={type} additionalWrapperStyles={'ic-container'}>
      {children}
    </InfoBox>
  )
}

export default NotificationBannerBase
