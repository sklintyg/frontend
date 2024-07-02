import { getNavigationItem, getNavigationItemUrl } from '@frontend/components/1177'
import { IDSBreadcrumbs, IDSCrumb } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import type { Params} from 'react-router-dom';
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

  if (matches.length === 0) {
    return null
  }

  const startLink = getNavigationItem('Start')

  return (
    <div className="mb-5">
      <IDSBreadcrumbs srlabel="Du är här" lead="Du är här:">
        {startLink && (
          <IDSCrumb key="start">
            <Link to={getNavigationItemUrl(startLink, import.meta.env.MODE)}>Start</Link>
          </IDSCrumb>
        )}
        {matches.map(resolveMatch).map(([url, node], index) =>
          index !== matches.length - 1 ? (
            <IDSCrumb key={url}>
              <Link to={url}>{node}</Link>
            </IDSCrumb>
          ) : (
            <span key={url}>{node}</span>
          )
        )}
        {prevMatchUrl && (
          <IDSCrumb key="mobile" mobile>
            <Link className="no-underline" to={prevMatchUrl}>
              {prevMatchNode}
            </Link>
          </IDSCrumb>
        )}
        {!prevMatchUrl && startLink && (
          <IDSCrumb key="mobile" mobile>
            <Link className="no-underline" to={getNavigationItemUrl(startLink, import.meta.env.MODE)}>
              Start
            </Link>
          </IDSCrumb>
        )}
      </IDSBreadcrumbs>
    </div>
  )
}
