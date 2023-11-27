import { PageHero, PageHeroActions, getNavigationItem } from '@frontend/components/1177'
import { IDSIconChevron, IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import { ErrorIdentifier } from '@frontend/components'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { ErrorType, ErrorTypeEnum } from '../../schema/error.schema'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'
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
    case ErrorType.enum['not-found']:
      return 'Sidan hittades inte'
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
    case ErrorType.enum['not-found']:
      return 'Sidan du söker har fått en ny adress eller är borttagen.'
    default:
      return 'På grund av ett tekniskt fel går det inte att visa Intyg just nu. Försök igen senare.'
  }
}

function getAction(type: ActionTypeEnum) {
  const startLinkItem = getNavigationItem('Start')

  switch (type) {
    case ActionType.enum.start:
      return (
        startLinkItem && (
          <IDSLink key="start">
            <IDSIconChevron />
            <Link to={resolveNavigationUrl(startLinkItem.url)}>Till startsidan</Link>
          </IDSLink>
        )
      )
    case ActionType.enum.login:
      return (
        <IDSLink key="login">
          <IDSIconChevron />
          <a href={import.meta.env.VITE_LOGIN_URL}>Till inloggning</a>
        </IDSLink>
      )
    case ActionType.enum['1177']:
      return (
        <IDSLink key="inera">
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
  return (
    <PageHero heading={getErrorHeading(type)} type={type === ErrorType.enum['logged-out'] ? 'success' : 'error'}>
      <p className="ids-preamble">{getErrorDescription(type)}</p>
      <PageHeroActions>{getActions(type).map(getAction)}</PageHeroActions>
      {id && (
        <div className="border-y border-stone-clear py-5">
          Om problemet kvarstår, spara nedan id och kontakta <SupportLink />
          <br />
          <ErrorIdentifier id={id} showTitle={false} />
        </div>
      )}
    </PageHero>
  )
}
