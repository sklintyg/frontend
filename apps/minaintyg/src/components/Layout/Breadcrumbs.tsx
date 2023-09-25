import { IDSBreadcrumbs, IDSCrumb } from '@frontend/ids-react-ts'
import { Link, Params, useMatches } from 'react-router-dom'

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

export function Breadcrumbs() {
  const matches = useMatches().filter(hasCrumb)
  const prevMatch = getMatchAt(-2, matches)

  return (
    <div className="mb-5">
      <IDSBreadcrumbs srlabel="Du är här" lead="Du är här:">
        {matches.map(({ handle, params, pathname }, index) =>
          index !== matches.length - 1 ? (
            <IDSCrumb key={pathname}>
              <Link to={pathname}>{handle.crumb(params)}</Link>
            </IDSCrumb>
          ) : (
            <span key={pathname}>{handle.crumb(params)}</span>
          )
        )}
        {prevMatch && (
          <IDSCrumb key="mobile" mobile>
            <Link to={prevMatch.pathname}>{prevMatch.crumb}</Link>
          </IDSCrumb>
        )}
      </IDSBreadcrumbs>
    </div>
  )
}
