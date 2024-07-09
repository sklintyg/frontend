import { useHistory } from 'react-router-dom'
import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { useAppSelector } from '../../../store/store'
import { getUserResourceLinks } from '../../../store/user/userSelectors'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'

function NavigateBackButton() {
  const history = useHistory()
  const navigateBackButton = useAppSelector(
    (state) => getUserResourceLinks(state)?.find((link) => link.type === ResourceLinkType.NAVIGATE_BACK_BUTTON)
  )

  return navigateBackButton && history.length > 0 ? (
    <StatusWithIcon icon="ArrowLeft">
      <LinkButton className="ic-link" onClick={history.goBack}>
        {navigateBackButton.name}
      </LinkButton>
    </StatusWithIcon>
  ) : null
}

export default NavigateBackButton
