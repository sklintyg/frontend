import InfoBox from '../../../components/utils/InfoBox'

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
