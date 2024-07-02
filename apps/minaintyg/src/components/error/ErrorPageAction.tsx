import { getNavigationItem, getNavigationItemUrl } from '@frontend/components/1177'
import { IDSIconChevron, IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import type { ErrorPageActionTypeEnum } from '../../schema/error.schema';
import { ErrorPageActionType } from '../../schema/error.schema'

export function ErrorPageAction({ type }: { type: ErrorPageActionTypeEnum }) {
  const startLinkItem = getNavigationItem('Start')

  if (type === ErrorPageActionType.enum.start) {
    return (
      startLinkItem && (
        <IDSLink key="start">
          <IDSIconChevron />
          <Link to={getNavigationItemUrl(startLinkItem, import.meta.env.MODE)}>Till startsidan</Link>
        </IDSLink>
      )
    )
  }

  if (type === ErrorPageActionType.enum.login) {
    return (
      <IDSLink key="login">
        <IDSIconChevron />
        <a href="/">Till inloggning</a>
      </IDSLink>
    )
  }

  if (type === ErrorPageActionType.enum[1177]) {
    return (
      <IDSLink key="inera">
        <IDSIconChevron />
        <Link to="https://www.1177.se">Till 1177</Link>
        <IDSIconExternal slot="append-icon" />
      </IDSLink>
    )
  }

  if (type === ErrorPageActionType.enum.about) {
    return (
      <IDSLink key="inera">
        <IDSIconChevron />
        <Link to="https://www.1177.se/om-1177/nar-du-loggar-in-pa-1177.se/det-har-kan-du-gora-nar-du-loggat-in/hantera-intyg/hantera-dina-lakarintyg-och-lakarutlatanden/">
          Om 1177 intyg
        </Link>
        <IDSIconExternal slot="append-icon" />
      </IDSLink>
    )
  }
}
