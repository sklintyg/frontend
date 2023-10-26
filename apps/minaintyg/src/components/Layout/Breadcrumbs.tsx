import { IDSBreadcrumbs, IDSCrumb } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { Link, Params, useMatches } from 'react-router-dom'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'
import navigationUrl from './LayoutHeader/data/1177-navbar-services.json'

type Match = ReturnType<typeof useMatches>[number]
type MatchWithCrumb = Match & {
  handle: { crumb: (data: Params<string>) => JSX.Element }
}

function hasCrumb(match: MatchWithCrumb | Match): match is MatchWithCrumb {
  return (match as MatchWithCrumb).handle !== undefined && typeof (match as MatchWithCrumb).handle.crumb === 'function'
}

function getMatchAt(index: number, matches: MatchWithCrumb[]): { pathname: string; crumb: JSX.Element } | null {
  const match = matches.at(index)
  return match ? { pathname: match.pathname, crumb: match.handle.crumb(match.params) } : null
}

function resolveMatchURL({ handle, params, pathname }: MatchWithCrumb): [string, ReactNode] {
  const node = handle.crumb(params)
  if (typeof node === 'string') {
    const item = pathname === '/' && navigationUrl.menu.items.find(({ name }) => name === node)
    if (item) {
      return [resolveNavigationUrl(item.url), node]
    }
  }
  return [pathname, node]
}

export function Breadcrumbs() {
  const matches = useMatches().filter(hasCrumb)
  const prevMatch = getMatchAt(-2, matches)

  return (
    <div className="mb-5">
      <IDSBreadcrumbs srlabel="Du är här" lead="Du är här:">
        {matches.map((match, index) => {
          const [url, node] = resolveMatchURL(match)
          return index !== matches.length - 1 ? (
            <IDSCrumb key={url}>
              <Link to={url}>{node}</Link>
            </IDSCrumb>
          ) : (
            <span key={url}>{node}</span>
          )
        })}
        {prevMatch && (
          <IDSCrumb key="mobile" mobile>
            <Link to={prevMatch.pathname}>{prevMatch.crumb}</Link>
          </IDSCrumb>
        )}
      </IDSBreadcrumbs>
    </div>
  )
}
