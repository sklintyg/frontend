import { IDSIconChevron, IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import navigation from '../../data/1177-navbar-services.json'
import { ErrorType, ErrorTypeEnum } from '../../schema/error.schema'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'
import { PageHero } from '../PageHero/PageHero'
import { PageHeroActions } from '../PageHero/PageHeroActions'
import { SupportLink } from './SupportLink/SupportLink'

const ActionType = z.enum(['start', 'login', '1177'])
export type ActionTypeEnum = z.infer<typeof ActionType>

function getErrorHeading(type?: ErrorTypeEnum) {
  switch (type) {
    case ErrorType.enum.unavailable:
      return 'Tjänsten är inte tillgänglig just nu'
    case ErrorType.enum['login-failed']:
      return 'Inloggning misslyckades'
    case ErrorType.enum['logged-out']:
      return 'Du är utloggad'
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
    case ErrorType.enum['logged-out']:
      return 'Du har antingen valt att logga ut eller blivit utloggad på grund av inaktivitet. Du kan nu stänga fliken eller logga in på nytt.'
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
    case ActionType.enum.login:
      return (
        <IDSLink>
          <IDSIconChevron />
          <Link to={import.meta.env.VITE_LOGIN_URL}>Till inloggning</Link>
        </IDSLink>
      )
    case ActionType.enum['1177']:
      return (
        <IDSLink>
          <IDSIconChevron />
          <Link to="https://www.1177.se">Till 1177</Link>
          <IDSIconExternal slot="append-icon" />
        </IDSLink>
      )
    default:
      return null
  }
}

function getActions(type?: ErrorTypeEnum): ActionTypeEnum[] {
  switch (type) {
    case ErrorType.enum.unavailable:
      return []
    case ErrorType.enum['logged-out']:
      return ['login', '1177']
    default:
      return ['start']
  }
}

export function ErrorPageHero({ id, type }: { id?: string; type?: ErrorTypeEnum }) {
  // TODO: useEffect hook that logs error back to the backend.
  return (
    <PageHero heading={getErrorHeading(type)} type={type === ErrorType.enum['logged-out'] ? 'success' : 'error'}>
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
