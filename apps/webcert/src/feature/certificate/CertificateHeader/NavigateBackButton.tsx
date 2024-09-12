import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithUserResourceLink } from '../../../components/utils/WithResourceLink'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'
import { useHistory } from 'react-router-dom'

function NavigateBackButton() {
  const history = useHistory()

  const handleGoBack = () => {
    if (history.action === 'POP') {
      history.push('/')
    } else {
      history.goBack()
    }
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
