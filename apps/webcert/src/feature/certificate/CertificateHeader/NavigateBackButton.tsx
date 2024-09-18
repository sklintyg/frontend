import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithUserResourceLink } from '../../../components/utils/WithResourceLink'
import { useGoBackEffect } from '../../../hooks/useGoBackEffect'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'

function NavigateBackButton() {
  const goBack = useGoBackEffect()

  return (
    <WithUserResourceLink type={ResourceLinkType.NAVIGATE_BACK_BUTTON}>
      {(link) => (
        <StatusWithIcon icon="ArrowLeft">
          <LinkButton className="ic-link" onClick={goBack}>
            {link.name}
          </LinkButton>
        </StatusWithIcon>
      )}
    </WithUserResourceLink>
  )
}

export default NavigateBackButton
