import { AppLink } from '@frontend/components'
import type { ErrorPageActionTypeEnum } from '../../schema/error.schema'
import { ErrorPageActionType } from '../../schema/error.schema'
import { useLinks } from '../../hooks/useLinks'

export function ErrorPageAction({ type }: { type: ErrorPageActionTypeEnum }) {
  const startLinkItem = useLinks().find((link) => link.name.toLowerCase() === 'start')

  if (type === ErrorPageActionType.enum.start) {
    return (
      startLinkItem && (
        <AppLink to={startLinkItem.url} arrow>
          Till startsidan
        </AppLink>
      )
    )
  }

  if (type === ErrorPageActionType.enum.login) {
    return (
      <AppLink key="login" to="/" target="self" arrow>
        Till inloggning
      </AppLink>
    )
  }

  if (type === ErrorPageActionType.enum[1177]) {
    return (
      <AppLink key="inera" to="https://www.1177.se" external arrow>
        Till 1177
      </AppLink>
    )
  }

  if (type === ErrorPageActionType.enum.support) {
    return (
      <AppLink key="inera" to="https://www.1177.se/e-tjanster-support" external arrow>
        Kontakta supporten
      </AppLink>
    )
  }

  if (type === ErrorPageActionType.enum.about) {
    return (
      <AppLink
        key="inera"
        to="https://www.1177.se/om-1177/nar-du-loggar-in-pa-1177.se/det-har-kan-du-gora-nar-du-loggat-in/hantera-intyg/hantera-dina-lakarintyg-och-lakarutlatanden/"
        external
        arrow
      >
        Om 1177 intyg
      </AppLink>
    )
  }
}
