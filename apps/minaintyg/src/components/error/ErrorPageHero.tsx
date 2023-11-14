import { IDSIconChevron, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import navigation from '../../data/1177-navbar-services.json'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'
import { PageHero } from '../PageHero/PageHero'
import { PageHeroActions } from '../PageHero/PageHeroActions'
import { SupportLink } from './SupportLink/SupportLink'

export const ErrorType = z.enum(['unknown', 'login-failed', 'unavailable'])
export type ErrorTypeEnum = z.infer<typeof ErrorType>
const ActionType = z.enum(['start'])
export type ActionTypeEnum = z.infer<typeof ActionType>

function getErrorHeading(type?: ErrorTypeEnum) {
  switch (type) {
    case ErrorType.enum.unavailable:
      return 'Tjänsten är inte tillgänglig just nu'
    case ErrorType.enum['login-failed']:
      return 'Inloggning misslyckades'
    default:
      return 'Någonting gick fel'
  }
}

function getErrorDescription(type?: ErrorTypeEnum) {
  switch (type) {
    case ErrorType.enum.unavailable:
      return 'Välkommen tillbaka vid senare tillfälle.'
    case ErrorType.enum['login-failed']:
      return 'På grund av ett tekniskt fel går det inte att logga in just nu. Försök igen senare.'
    default:
      return 'På grund av ett tekniskt fel går det inte att visa Intyg just nu. Försök igen senare.'
  }
}

function getAction(type: ActionTypeEnum) {
  const startLinkItem = navigation.menu.items.find(({ name }) => name === 'Start')

  switch (type) {
    case ActionType.enum.start:
      return (
        startLinkItem && (
          <IDSLink>
            <IDSIconChevron />
            <Link to={resolveNavigationUrl(startLinkItem.url)}>Till startsidan</Link>
          </IDSLink>
        )
      )
    default:
      return null
  }
}

function getActions(type?: ErrorTypeEnum): ActionTypeEnum[] {
  switch (type) {
    case ErrorType.enum.unavailable:
      return []
    default:
      return ['start']
  }
}

export function ErrorPageHero({ id, type }: { id?: string; type?: ErrorTypeEnum }) {
  // TODO: useEffect hook that logs error back to the backend.
  return (
    <PageHero heading={getErrorHeading(type)} type="error">
      <p className="ids-preamble">{getErrorDescription(type)}</p>
      <PageHeroActions>{getActions(type).map(getAction)}</PageHeroActions>
      {id && (
        <div className="border-y border-stone-clear py-5">
          Om problemet kvarstår, spara nedan id och kontakta <SupportLink />
          <br />
          <strong>{id}</strong>
        </div>
      )}
    </PageHero>
  )
}
