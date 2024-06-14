import { ErrorIdentifier } from '@frontend/components'
import { PageHero, PageHeroActions } from '@frontend/components/1177'
import { ErrorPageActionType, ErrorType, ErrorTypeEnum } from '../../schema/error.schema'
import { ErrorPageAction } from './ErrorPageAction'
import { SupportLink } from './SupportLink/SupportLink'

const errorInfo = {
  [ErrorType.enum.unavailable]: {
    heading: 'Tjänsten är inte tillgänglig just nu',
    description: 'Välkommen tillbaka vid senare tillfälle.',
    actions: [],
  },
  [ErrorType.enum['login-failed']]: {
    heading: 'Inloggning misslyckades',
    description: 'På grund av ett tekniskt fel går det inte att logga in just nu. Försök igen senare.',
    actions: [ErrorPageActionType.enum.start],
  },
  [ErrorType.enum['logged-out']]: {
    heading: 'Du är utloggad',
    description:
      'Du har antingen valt att logga ut eller blivit utloggad på grund av inaktivitet. Du kan nu stänga fliken eller logga in på nytt.',
    actions: [ErrorPageActionType.enum.login, ErrorPageActionType.enum[1177]],
  },
  [ErrorType.enum['not-found']]: {
    heading: 'Sidan hittades inte',
    description: 'Sidan du söker har fått en ny adress eller är borttagen.',
    actions: [ErrorPageActionType.enum.start],
  },
  [ErrorType.enum.underage]: {
    heading: 'Du som är under 16 har inte tillgång till 1177 intyg',
    description: 'Vänd dig till din mottagning om du har frågor eller behöver en kopia av ditt intyg.',
    actions: [ErrorPageActionType.enum.start, ErrorPageActionType.enum.about],
  },
  [ErrorType.enum.unknown]: {
    heading: 'Någonting gick fel',
    description: 'På grund av ett tekniskt fel går det inte att visa Intyg just nu. Försök igen senare.',
    actions: [ErrorPageActionType.enum.start],
  },
} as const

function getErrorHeading(type?: ErrorTypeEnum) {
  return (type !== undefined && errorInfo[type]?.heading) || errorInfo.unknown.heading
}

function getErrorDescription(type?: ErrorTypeEnum) {
  return (type !== undefined && errorInfo[type]?.description) || errorInfo.unknown.description
}

function getActions(type?: ErrorTypeEnum) {
  return (type !== undefined && errorInfo[type]?.actions) || errorInfo.unknown.actions
}

export function ErrorPageHero({ id, type }: { id?: string; type?: ErrorTypeEnum }) {
  return (
    <PageHero heading={getErrorHeading(type)} type={type === ErrorType.enum['logged-out'] ? 'success' : 'error'}>
      <p className="ids-preamble">{getErrorDescription(type)}</p>
      <PageHeroActions>
        {getActions(type).map((t) => (
          <ErrorPageAction type={t} key={t} />
        ))}
      </PageHeroActions>
      {id && type !== ErrorType.enum['logged-out'] && (
        <div className="border-y border-stone-clear py-5">
          Om problemet kvarstår, spara nedan id och kontakta <SupportLink />
          <br />
          <ErrorIdentifier id={id} showTitle={false} />
        </div>
      )}
    </PageHero>
  )
}
