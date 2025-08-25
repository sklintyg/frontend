import { getNavigationItem, getNavigationItemUrl } from '@frontend/components/1177'
import { IDSBreadcrumbs } from '@inera/ids-react'
import type { ReactNode } from 'react'
import type { Params } from 'react-router-dom'
import { Link, useMatches } from 'react-router-dom'

type Match = ReturnType<typeof useMatches>[number]
type MatchWithCrumb = Match & {
  handle: { crumb: (data: Params<string>) => React.JSX.Element }
}

function hasCrumb(match: MatchWithCrumb | Match): match is MatchWithCrumb {
  return (match as MatchWithCrumb).handle !== undefined && typeof (match as MatchWithCrumb).handle.crumb === 'function'
}

function resolveMatch({ handle, params, pathname }: MatchWithCrumb): [string, ReactNode] {
  return [pathname, handle.crumb(params)]
}

export function Breadcrumbs() {
  const matches = useMatches().filter(hasCrumb)
  const prevMatch = matches ? matches[matches.length - 2] : undefined
  const [prevMatchUrl, prevMatchNode] = prevMatch ? resolveMatch(prevMatch) : []

  const startLink = getNavigationItem('Start')
  const startLinkComposed = startLink ? (
    <Link key="start" to={getNavigationItemUrl(startLink, import.meta.env.MODE)}>
      Start
    </Link>
  ) : undefined

  return (
    <div className="mb-5">
      <IDSBreadcrumbs lead="Du är här:" mobileLink={prevMatchUrl ? <Link to={prevMatchUrl}>{prevMatchNode}</Link> : startLinkComposed}>
        {startLinkComposed}
        {matches.map(resolveMatch).map(([url, node]) => (
          <Link key={url} to={url}>
            {node}
          </Link>
        ))}
      </IDSBreadcrumbs>
    </div>
  )
}
