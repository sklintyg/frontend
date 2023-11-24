import { IDSBreadcrumbs, IDSCrumb } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { Link, Params, useMatches } from 'react-router-dom'
import navigation from '../../data/1177-navbar-services.json'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'

type Match = ReturnType<typeof useMatches>[number]
type MatchWithCrumb = Match & {
  handle: { crumb: (data: Params<string>) => JSX.Element }
}

function hasCrumb(match: MatchWithCrumb | Match): match is MatchWithCrumb {
  return (match as MatchWithCrumb).handle !== undefined && typeof (match as MatchWithCrumb).handle.crumb === 'function'
}

function resolveMatch({ handle, params, pathname }: MatchWithCrumb): [string, ReactNode] {
  const node = handle.crumb(params)
  if (typeof node === 'string') {
    const item = pathname === '/' && navigation.menu.items.find(({ name }) => name === node)
    if (item) {
      return [resolveNavigationUrl(item.url), node]
    }
  }
  return [pathname, node]
}

export function Breadcrumbs() {
  const matches = useMatches().filter(hasCrumb)
  const prevMatch = matches.at(-2)
  const [prevMatchUrl, prevMatchNode] = prevMatch ? resolveMatch(prevMatch) : []

  if (matches.length === 0) {
    return null
  }

  return (
    <div className="mb-5">
      <IDSBreadcrumbs srlabel="Du är här" lead="Du är här:">
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
      </IDSBreadcrumbs>
    </div>
  )
}
