import { useNavigate } from 'react-router-dom'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithUserResourceLink } from '../../../components/utils/WithResourceLink'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'

function NavigateBackButton() {
  const navigate = useNavigate()

  return (
    <WithUserResourceLink type={ResourceLinkType.NAVIGATE_BACK_BUTTON}>
      {(link) => (
        <StatusWithIcon icon="ArrowLeft">
          <LinkButton className="ic-link" onClick={() => navigate(-1)}>
            {link.name}
          </LinkButton>
        </StatusWithIcon>
      )}
    </WithUserResourceLink>
  )
}

export default NavigateBackButton
