import StatusWithIcon from '../../../components/utils/StatusWithIcon'
import { WithUserResourceLink } from '../../../components/utils/WithResourceLink'
import { LinkButton } from '../../../styles'
import { ResourceLinkType } from '../../../types'
import { useHistory } from 'react-router-dom'
import { useGoBack } from '../../../hooks/useGoBack'
import { useEffect } from 'react'

function NavigateBackButton() {
  const history = useHistory()
  const goBack = useGoBack()

  useEffect(() => {
    const unlisten = history.listen(() => {
      const isForreignReferrer = document.referrer != '' && !document.referrer.includes(window.location.host)
      if (isForreignReferrer) {
        unlisten()
        window.location.replace(window.location.pathname)
      }
      return unlisten
    })
  }, [history])

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
