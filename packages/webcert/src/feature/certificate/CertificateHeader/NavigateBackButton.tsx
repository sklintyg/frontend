import { LinkButton, ResourceLinkType, StatusWithIcon } from '@frontend/common'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getUserResourceLinks } from '../../../store/user/userSelectors'

const NavigateBackButton: React.FC = () => {
  const history = useHistory()
  const userLinks = useSelector(getUserResourceLinks)
  const navigateBackButton = userLinks?.find((link) => link.type === ResourceLinkType.NAVIGATE_BACK_BUTTON)

  const handleGoBack = () => {
    if (history.action === 'POP') {
      history.push('/')
    } else {
      history.goBack()
    }
  }

  return navigateBackButton && history.length > 0 ? (
    <StatusWithIcon icon="ArrowLeft">
      <LinkButton className="ic-link" onClick={handleGoBack}>
        {navigateBackButton.name}
      </LinkButton>
    </StatusWithIcon>
  ) : (
    <></>
  )
}

export default NavigateBackButton
