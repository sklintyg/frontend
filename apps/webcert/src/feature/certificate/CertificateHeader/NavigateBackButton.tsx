import { useHistory } from 'react-router-dom'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithUserResourceLink } from '../../../components/utils/WithResourceLink'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'

function NavigateBackButton() {
  const history = useHistory()

  return (
    <WithUserResourceLink type={ResourceLinkType.NAVIGATE_BACK_BUTTON}>
      {(link) => (
        <StatusWithIcon icon="ArrowLeft">
          <LinkButton className="ic-link" onClick={history.goBack}>
            {link.name}
          </LinkButton>
        </StatusWithIcon>
      )}
    </WithUserResourceLink>
  )
}

export default NavigateBackButton
