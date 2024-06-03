import { useHistory } from 'react-router-dom'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithUserResourceLink } from '../../../components/utils/WithResourceLink'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'

const NavigateBackButton: React.FC = () => {
  const history = useHistory()

  const handleGoBack = () => {
    if (history.action === 'POP') {
      history.push('/')
    } else {
      history.goBack()
    }
  }

  if (history.length === 0) {
    return null
  }

  return (
    <WithUserResourceLink type={ResourceLinkType.NAVIGATE_BACK_BUTTON}>
      {(link) => (
        <StatusWithIcon icon="ArrowLeft">
          <LinkButton className="ic-link" onClick={handleGoBack}>
            {link.name}
          </LinkButton>
        </StatusWithIcon>
      )}
    </WithUserResourceLink>
  )
}

export default NavigateBackButton
